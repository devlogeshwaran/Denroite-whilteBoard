import express from 'express';
import { createBoard, getBoard, joinBoard, removeParticipant } from '../controllers/board.controller';

const router = express.Router();

router.get('/:id', getBoard)
router.post('/', createBoard)
router.put('/', joinBoard)
router.put('/leave/:id', removeParticipant)

export default router