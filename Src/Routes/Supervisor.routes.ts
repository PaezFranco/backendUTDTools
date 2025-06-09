import { Router } from 'express';
import { completeStudentProfile } from '../Controllers/Supervisor.controller';
import { verifyToken } from '../Middlewares/Auth.middleware';

const router = Router();

router.put('/complete-student/:id', verifyToken, completeStudentProfile);

export default router;