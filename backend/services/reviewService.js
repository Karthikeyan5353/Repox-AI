import { buildDiffLookup } from '../utils/diffParser.js';
import { getFileContent, getPullRequest, getPullRequestFiles, postInlineComment, postIssueComment } from './githubService.js';
import { findById, findOne, insert, updateById, upsert } from './dataStore.js';
import { getLearningContext, recordLearnings } from './learningService.js';
import { reviewCodeWithAi } from './openaiService.js';

function splitIntoBatches(files, maxChars = 16000) {
  const batches = [];
  let current = [];
  let currentChars = 0;

  for (const file of files) {
    const serialized = JSON.stringify({
      path: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      patch: file.patch || '',
    });

    if (current.length && currentChars + serialized.length > maxChars) {
      batches.push(current);
      current = [];
      currentChars = 0;
    }

    current.push(file);
    currentChars += serialized.length;
  }

  if (current.length) {
    batches.push(current);
  }

  return batches;
}

function normalizeIssues(issues, diffLookup) {
  return (issues || [])
    .filter((issue) => issue?.title && issue?.filePath)
    .map((issue) => {
      const validLines = diffLookup.get(issue.filePath);
      const lineNumber =
        validLines && validLines.size && issue.lineNumber && validLines.has(issue.lineNumber)
          ? issue.lineNumber
          : undefined;

      return {
        filePath: issue.filePath,
        lineNumber,
        title: issue.title,
        description: issue.description || '',
        suggestedFix: issue.suggestedFix || '',
        severity: ['low', 'medium', 'high'].includes(issue.severity) ? issue.severity : 'medium',
        category: issue.category || 'quality',
        confidence: Number(issue.confidence || 0.65),
      };
    });
}

function mergeSummaries(summaries) {
  return summaries.filter(Boolean).join('\n\n');
}

export async function analyzePullRequest({ repositoryId, pullRequestNumber, token }) {
  const repository = await findById('repositories', repositoryId);
  if (!repository) {
    throw new Error('Repository not found');
  }

  const pullRequestData = await getPullRequest(token, repository.owner, repository.name, pullRequestNumber);
  const files = await getPullRequestFiles(token, repository.owner, repository.name, pullRequestNumber);
  const diffLookup = buildDiffLookup(files);
  const learnings = await getLearningContext();
  const batches = splitIntoBatches(files.filter((file) => file.patch));

  const reviews = [];
  for (const batch of batches) {
    const result = await reviewCodeWithAi({
      repository: JSON.stringify(
        {
          fullName: repository.fullName,
          description: repository.description,
          defaultBranch: repository.defaultBranch,
        },
        null,
        2
      ),
      pullRequest: JSON.stringify(
        {
          number: pullRequestData.number,
          title: pullRequestData.title,
          body: pullRequestData.body,
          base: pullRequestData.base?.ref,
          head: pullRequestData.head?.ref,
        },
        null,
        2
      ),
      learnings,
      files: JSON.stringify(
        batch.map((file) => ({
          filePath: file.filename,
          status: file.status,
          additions: file.additions,
          deletions: file.deletions,
          patch: file.patch || '',
        })),
        null,
        2
      ),
    });

    reviews.push(result);
  }

  const mergedIssues = normalizeIssues(
    reviews.flatMap((result) => result.parsed.issues || []),
    diffLookup
  );
  const summary = mergeSummaries(reviews.map((result) => result.parsed.summary));

  let pullRequest = await findOne('pullRequests', { repository: repository._id, number: pullRequestNumber });
  if (!pullRequest) {
    pullRequest = await insert('pullRequests', {
      repository: repository._id,
      githubId: pullRequestData.id,
      number: pullRequestData.number,
      title: pullRequestData.title,
      state: pullRequestData.state,
      merged: pullRequestData.merged,
      author: pullRequestData.user?.login,
      htmlUrl: pullRequestData.html_url,
      baseBranch: pullRequestData.base?.ref,
      headBranch: pullRequestData.head?.ref,
      baseSha: pullRequestData.base?.sha,
      headSha: pullRequestData.head?.sha,
      additions: pullRequestData.additions,
      deletions: pullRequestData.deletions,
      changedFiles: pullRequestData.changed_files,
      createdAtGithub: pullRequestData.created_at,
      updatedAtGithub: pullRequestData.updated_at,
      mergedAt: pullRequestData.merged_at,
    });
  }

  const review = await insert('reviews', {
    repository: repository._id,
    pullRequest: pullRequest._id,
    pullRequestNumber,
    scopeType: 'pr',
    summary,
    issues: mergedIssues,
    metrics: {
      totalIssues: mergedIssues.length,
      highSeverity: mergedIssues.filter((issue) => issue.severity === 'high').length,
      mediumSeverity: mergedIssues.filter((issue) => issue.severity === 'medium').length,
      lowSeverity: mergedIssues.filter((issue) => issue.severity === 'low').length,
      filesReviewed: files.length,
    },
    model: reviews[0]?.model,
    rawResponse: reviews.map((result) => result.raw),
    usage: reviews.reduce(
      (aggregate, result) => ({
        input_tokens: (aggregate.input_tokens || 0) + (result.usage?.input_tokens || 0),
        output_tokens: (aggregate.output_tokens || 0) + (result.usage?.output_tokens || 0),
        total_tokens: (aggregate.total_tokens || 0) + (result.usage?.total_tokens || 0),
      }),
      {}
    ),
  });

  pullRequest = await updateById('pullRequests', pullRequest._id, {
    lastReviewedAt: new Date().toISOString(),
    reviewStatus: 'reviewed',
  });

  await recordLearnings(mergedIssues, review._id);

  return {
    review,
    repository,
    pullRequest,
    files,
  };
}

export async function analyzeSingleFile({ repositoryId, filePath, ref, token }) {
  const repository = await findById('repositories', repositoryId);
  if (!repository) {
    throw new Error('Repository not found');
  }

  const content = await getFileContent(token, repository.owner, repository.name, filePath, ref);
  const learnings = await getLearningContext();
  const result = await reviewCodeWithAi({
    repository: JSON.stringify(
      {
        fullName: repository.fullName,
        description: repository.description,
      },
      null,
      2
    ),
    pullRequest: JSON.stringify(
      {
        type: 'single-file-review',
        filePath,
        ref,
      },
      null,
      2
    ),
    learnings,
    files: JSON.stringify(
      [
        {
          filePath,
          content,
        },
      ],
      null,
      2
    ),
  });

  const review = await insert('reviews', {
    repository: repository._id,
    scopeType: 'file',
    scopePath: filePath,
    summary: result.parsed.summary,
    issues: result.parsed.issues || [],
    metrics: {
      totalIssues: (result.parsed.issues || []).length,
    },
    model: result.model,
    rawResponse: result.raw,
    usage: result.usage,
  });

  await recordLearnings(review.issues, review._id);

  return {
    review,
    content,
  };
}

export async function postReviewToGithub({ reviewId, token }) {
  const review = await findById('reviews', reviewId);
  if (!review) {
    throw new Error('Review not found');
  }

  const repository = await findById('repositories', review.repository);
  const pullRequest = await findById('pullRequests', review.pullRequest);

  if (!pullRequest) {
    throw new Error('Only pull request reviews can be posted to GitHub');
  }

  const owner = repository.owner;
  const repo = repository.name;
  const pullNumber = pullRequest.number;
  const commitId = pullRequest.headSha;
  let commentsPosted = 0;

  const summaryComment = await postIssueComment(
    token,
    owner,
    repo,
    pullNumber,
    [
      '## RepoX AI Review Summary',
      '',
      review.summary || 'Automated review completed.',
      '',
      ...review.issues.slice(0, 10).map(
        (issue) =>
          `- **${issue.severity.toUpperCase()}** \`${issue.filePath}${issue.lineNumber ? `:${issue.lineNumber}` : ''}\` - ${issue.title}`
      ),
    ].join('\n')
  );

  commentsPosted += 1;

  for (const issue of review.issues.filter((item) => item.lineNumber)) {
    try {
      const comment = await postInlineComment(token, owner, repo, pullNumber, {
        body: `**${issue.title}**\n\n${issue.description}\n\nSuggested fix:\n${issue.suggestedFix}`,
        commit_id: commitId,
        path: issue.filePath,
        line: issue.lineNumber,
        side: 'RIGHT',
      });

      issue.githubCommentId = comment.id;
      commentsPosted += 1;
    } catch {
      continue;
    }
  }

  await updateById('reviews', review._id, {
    ...review,
    issues: review.issues,
    githubCommentsPosted: commentsPosted,
  });

  await updateById('pullRequests', pullRequest._id, {
    reviewStatus: 'commented',
  });

  return {
    reviewId: review._id,
    summaryCommentId: summaryComment.id,
    commentsPosted,
  };
}
