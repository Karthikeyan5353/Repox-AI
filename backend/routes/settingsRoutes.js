import express from 'express';
import { connectGithub, connectOpenAi, getStatus } from '../controllers/settingsController.js';

const router = express.Router();

router.get('/status', getStatus);
router.post('/github', connectGithub);
router.post('/openai', connectOpenAi);

export default router;
