import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    messagerId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Conversation = mongoose.model('conversation', conversationSchema);

export default Conversation;
