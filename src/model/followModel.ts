import mongoose from 'mongoose';

const followSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        follower: [
            {
                follower_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                time: Date,
            },
        ],
    },
    { timestamps: true },
);

const Follow = mongoose.model('follower', followSchema);

export default Follow;
