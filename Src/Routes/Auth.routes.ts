import { Router } from 'express';
import { loginStudent, registerStudent } from '../Controllers/Auth.controller';

const router = Router();

router.post('/student/login', loginStudent);
router.post('/student/register', registerStudent);

export default router;