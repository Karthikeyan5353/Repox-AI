import express from 'express';
import {
  getPullRequestDetailsController,
  listPullRequestsController,
  postReviewCommentsController,
  reviewPullRequestController,
} from '../controllers/pullRequestController.js';

const router = express.Router();

router.get('/:repositoryId', listPullRequestsController);
router.get('/:repositoryId/:pullRequestNumber', getPullRequestDetailsController);
router.post('/:repositoryId/:pullRequestNumber/review', reviewPullRequestController);
router.post('/comments/post', postReviewCommentsController);

export default router;
