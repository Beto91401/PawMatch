// server/models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  senderUsername: { type: String, required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiverUsername: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
