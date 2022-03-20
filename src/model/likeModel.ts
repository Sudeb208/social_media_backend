import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
    {
        post_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'posts',
        },
        isPost: Boolean,
        Comment_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comment',
        },
        React: [
            {
                like: String,
                user_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
            },
        ],
    },
    { timestamps: true },
);

const React = mongoose.model('react', likeSchema);

export default React;
