import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import employeeRoutes from './routes/employees';
import announcementRoutes from './routes/announcements';
import linkRoutes from './routes/links';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/employees', apiLimiter, employeeRoutes);
app.use('/api/announcements', apiLimiter, announcementRoutes);
app.use('/api/links', apiLimiter, linkRoutes);
app.use('/api/auth', authLimiter, authRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

export default app;
