import express,{ Request, Response } from 'express';
import { login, register } from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup', register)

router.post('/login', login)



export default router;