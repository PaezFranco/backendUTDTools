import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './Routes/Auth.routes';
import studentRoutes from './Routes/Student.routes';
import toolRoutes from './Routes/Tool.routes';
import loanRoutes from './Routes/Loan.routes';

import testRoutes from './Routes/Test.routes';



dotenv.config();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Register routes
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/loans', loanRoutes);

export default app;
