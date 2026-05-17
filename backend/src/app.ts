import express from 'express';
import cors from 'cors';
import { resolve } from 'path';
import { errorHandler } from './api/middleware/errorHandler.js';
import { requestLogger } from './api/middleware/requestLogger.js';
import { router } from './api/routes/index.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Serve uploaded images locally
const uploadsDir = process.env.UPLOADS_DIR ?? './uploads';
app.use('/uploads', express.static(resolve(uploadsDir)));

app.use('/api/v1', router);

app.use(errorHandler);

export { app };
