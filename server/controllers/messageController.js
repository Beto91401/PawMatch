import Message from '../models/Message.js'; // Assuming you have a Message model
import User from '../models/User.js'; // Assuming you have a User model for user information

export const sendMessage = async (req, res) => {
    const { senderUsername, receiverUsername, content } = req.body;

    try {
        const sender = await User.findOne({ username: senderUsername });
        const receiver = await User.findOne({ username: receiverUsername });

        if (!sender || !receiver) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const message = new Message({
            senderId: sender._id,
            senderUsername: sender.username, // Ensure senderUsername is saved
            receiverId: receiver._id,
            receiverUsername: receiver.username, // Ensure receiverUsername is saved
            content,
            timestamp: new Date()
        });

        await message.save();
        res.json({ success: true, message: 'Message sent successfully', data: message });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, message: 'Error sending message', error });
    }
};


export const getMessages = async (req, res) => {
    const { userId1, userId2 } = req.params;

    try {
        const user1 = await User.findOne({ username: userId1 });
        const user2 = await User.findOne({ username: userId2 });

        if (!user1 || !user2) {
            return res.status(404).json({ message: 'User not found' });
        }

        const messages = await Message.find({
            $or: [
                { senderId: user1._id, receiverId: user2._id },
                { senderId: user2._id, receiverId: user1._id }
            ]
        }).sort({ timestamp: 1 });

        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error: error.message });
    }
};
