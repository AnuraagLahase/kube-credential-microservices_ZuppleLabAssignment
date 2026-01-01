import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Conditionally import real or mock routes
const isTest = process.env.NODE_ENV === 'test';

const credentialRouter = isTest
  ? require('./routes/credentialRoutes.mock').default
  : require('./routes/credentialRoutes').default;


dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:3001' }));
app.use(express.json());

// Mount routes
app.use('/api/credentials', credentialRouter);

app.get('/', (req, res) => res.send('Kube Credential Backend API is running'));

export default app;
