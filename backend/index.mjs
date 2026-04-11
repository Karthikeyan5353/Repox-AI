import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dashboardRoutes from './routes/dashboardRoutes.js';
import learningRoutes from './routes/learningRoutes.js';
import pullRequestRoutes from './routes/pullRequestRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import repositoryRoutes from './routes/repositoryRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import { errorHandler, notFoundHandler } from './utils/errorHandlers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

const app = express();
const port = process.env.BACKEND_PORT || 4000;

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN?.split(',').map((origin) => origin.trim()) || '*',
  })
);
app.use(express.json({ limit: '4mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_request, response) => {
  response.json({
    ok: true,
    service: 'repox-ai-backend',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/settings', settingsRoutes);
app.use('/api/repositories', repositoryRoutes);
app.use('/api/pull-requests', pullRequestRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/learnings', learningRoutes);
app.use('/api/reports', reportRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  app.listen(port, () => {
    console.log(`RepoX AI backend listening on port ${port}`);
    console.log('Persistence: local JSON store');
  });
}

start().catch((error) => {
  console.error('Failed to start backend', error);
  process.exit(1);
});
