import { Router } from 'express';
import { getIaSuggestions, markIaSuggestionAsAttended } from '../Controllers/IaSuggestion.controller';
import { verifyToken } from '../Middlewares/Auth.middleware';

const router = Router();

router.get('/', verifyToken, getIaSuggestions);
router.put('/:id/attend', verifyToken, markIaSuggestionAsAttended);

export default router;
