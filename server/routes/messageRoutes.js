// server/routes/messageRoutes.js
import express from 'express';
import { sendMessage, getMessages } from '../controllers/messageController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

// Route to send a message
router.post('/send', authenticateToken, sendMessage);

// Route to get messages between two users
router.get('/:userId1/:userId2', authenticateToken, getMessages);

export default router;
