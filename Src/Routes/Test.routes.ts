import { Router } from 'express';
import { testRoute } from '../test.controller';

const router = Router();

router.get('/ping', testRoute);

export default router;
