import express from 'express';
import {
  getRepositoryDetails,
  getRepositoryFileController,
  getRepositoryTreeController,
  listSavedRepositories,
  reviewSingleFileController,
  syncRepositories,
} from '../controllers/repositoryController.js';

const router = express.Router();

router.get('/', listSavedRepositories);
router.post('/sync', syncRepositories);
router.get('/:repositoryId', getRepositoryDetails);
router.get('/:repositoryId/tree', getRepositoryTreeController);
router.get('/:repositoryId/file', getRepositoryFileController);
router.post('/:repositoryId/review-file', reviewSingleFileController);

export default router;
