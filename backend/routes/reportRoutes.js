import express from 'express';
import { getReportsController } from '../controllers/reportController.js';

const router = express.Router();

router.get('/', getReportsController);

export default router;
