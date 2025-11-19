import express from 'express';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin: allowedOrigins.length ? allowedOrigins : true,
  credentials: true,
};
const corsMiddleware = cors(corsOptions);

app.use(corsMiddleware);
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    corsMiddleware(req, res, () => {
      res.sendStatus(204);
    });
    return;
  }
  next();
});
app.use(express.json());
app.use(cookieParser());
app.use('/api', routes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorHandler);

export default app;
