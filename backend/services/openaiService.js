import OpenAI from 'openai';
import { getOpenAiConfig } from './settingsService.js';

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function extractJsonFromResponse(text) {
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch {}
  
  // Try removing markdown code blocks
  const cleanText = text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
  
  try {
    return JSON.parse(cleanText);
  } catch {}
  
  // Try extracting JSON from text
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {}
  }
  
  return null;
}

export async function reviewCodeWithAi(payload) {
  const { apiKey, model } = await getOpenAiConfig();
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  const client = new OpenAI({ apiKey });
  const prompt = `You are an expert code reviewer. Analyze the provided code and return ONLY a valid JSON object with this exact structure:
{
  "summary": "Brief summary of the review findings",
  "issues": [
    {
      "filePath": "path/to/file",
      "lineNumber": 12,
      "title": "Issue title",
      "description": "Why this matters",
      "suggestedFix": "Concrete fix",
      "severity": "low|medium|high",
      "category": "bug|security|performance|quality|best-practice",
      "confidence": 0.95
    }
  ]
}

Guidelines:
- Only flag meaningful issues that would impact production
- For each issue, specify the exact file path and line number
- Categories: bug, security, performance, quality, best-practice
- Severity: low (minor), medium (important), high (critical)
- Confidence: 0.0 to 1.0 (how confident you are about the issue)
- Keep suggested fixes actionable and specific
- Return valid JSON only, no markdown code blocks

Repository context:
${payload.repository}

Pull request context:
${payload.pullRequest}

Existing learnings from previous reviews (use these patterns):
${payload.learnings || 'No previous learnings'}

Files to review:
${payload.files}

Return ONLY the JSON object, nothing else.`;

  const response = await client.chat.completions.create({
    model,
    temperature: 0.2,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const responseText = response.choices?.[0]?.message?.content || '{}';
  const parsed = extractJsonFromResponse(responseText);

  if (!parsed || !parsed.issues) {
    console.error('Failed to parse AI response:', responseText.slice(0, 200));
    throw new Error('AI response could not be parsed as valid JSON');
  }

  return {
    model,
    parsed,
    raw: response,
    usage: {
      input_tokens: response.usage?.prompt_tokens || 0,
      output_tokens: response.usage?.completion_tokens || 0,
      total_tokens: response.usage?.total_tokens || 0,
    },
  };
}

export async function chatWithRepository(prompt, context) {
  const { apiKey, model } = await getOpenAiConfig();
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  const client = new OpenAI({ apiKey });
  const response = await client.chat.completions.create({
    model,
    temperature: 0.7,
    messages: [
      {
        role: 'user',
        content: `You are a repository assistant. Answer clearly and cite file paths when possible.

Repository context:
${context}

User question:
${prompt}`,
      },
    ],
  });

  return {
    model,
    answer: response.choices?.[0]?.message?.content || '',
    usage: {
      input_tokens: response.usage?.prompt_tokens || 0,
      output_tokens: response.usage?.completion_tokens || 0,
      total_tokens: response.usage?.total_tokens || 0,
    },
  };
}
