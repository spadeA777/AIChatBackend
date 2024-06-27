import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    address: String,
    chainId: Number,
    messages: [{
        role: String,
        content: String,
    }], // chat history; role, content, timestamp
    summary: String,
    last_chat: Date,
    character: {
        type: mongoose.Types.ObjectId,
        ref: "Character"
    }
}, { timestamps: true });

const Chat = mongoose.model('Chat', ChatSchema)

export default Chat;
 