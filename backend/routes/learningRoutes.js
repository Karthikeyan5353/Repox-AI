import express from 'express';
import { exportLearningsController, listLearningsController } from '../controllers/learningController.js';

const router = express.Router();

router.get('/', listLearningsController);
router.get('/export.csv', exportLearningsController);

export default router;
