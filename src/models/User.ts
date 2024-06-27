import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    wallet: {
        type: String,
        unique: true,
        required: true
    },
    nickName: {
        type: String,
        required: true
    },
    balance: Object, 
    nfts: [String],
    isFirstDeposit: Boolean,
    isPremium: Boolean,
    avatar: String,
    followers: Number,
    following: Number,
    invite_code: String,
    referral_code: String,
    characters: [{
        type: mongoose.Types.ObjectId,
        ref: "Character"
    }]
}, { timestamps: true });

const User = mongoose.model('User', UserSchema)

export default User;
 