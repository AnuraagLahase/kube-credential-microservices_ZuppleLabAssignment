import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';


import verificationRouter from './routes/verificationRoutes';

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:3001' }));
app.use(express.json());

// Mount routes
app.use('/api/verification', verificationRouter);

app.get('/', (req, res) => res.send('Kube Verification Backend API is running'));

export default app;
