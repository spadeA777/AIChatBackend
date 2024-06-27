import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CharacterSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    avatar_img: String,
    cover_img: String,
    intro: String,
    bio: String,
    prompt: String,
    chatmodel: String,
    lang: String,
    voice: String,
    exp: Number,
    votes: Number,
    unvotes: Number,
    history: [Object], // user, chat_id, last_at
    price: Number, // chat price
    tags: [String], // hot, featured, new, original, trending, top etc
    isPublished: String,
    created_at: Date,
    published_at: Date,
    model: String,  // character img for d-id character, resource url for live2d character : nft character
    config: Object, // chatmodel config; idle, happy, sad, bad etc expression and motion config
    nft: String,
    accessories: [String],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

const Character = mongoose.model('Character', CharacterSchema)

export default Character;
