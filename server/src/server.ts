import express from 'express';
import dotenv from "dotenv";
import authRouter from './routes/auth.route';
import boardRouter from './routes/board.route';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: false
}));

app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/board', boardRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
