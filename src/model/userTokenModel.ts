import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        token_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
    },
    { timestamps: true },
);

const TokenModel = mongoose.model('user_token', tokenSchema);

export default TokenModel;
