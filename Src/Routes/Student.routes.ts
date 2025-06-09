import { Router } from 'express';
import { getStudentProfile, getStudentLoanHistory } from '../Controllers/Student.controller';
import { verifyToken } from '../Middlewares/Auth.middleware';

const router = Router();

router.get('/profile', verifyToken, getStudentProfile);
router.get('/history', verifyToken, getStudentLoanHistory);

export default router;