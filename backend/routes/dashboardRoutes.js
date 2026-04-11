import express from 'express';
import { getDashboardController } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/', getDashboardController);

export default router;
