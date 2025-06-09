import { Router } from 'express';
import { getAllTools, createTool } from '../Controllers/Tool.controller';
import { verifyToken } from '../Middlewares/Auth.middleware';

const router = Router();

router.get('/', verifyToken, getAllTools);
router.post('/', verifyToken, createTool);

export default router;
