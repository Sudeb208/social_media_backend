import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        post_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'posts',
            required: true,
        },
        comment: [
            {
                mainComment: String,
                user_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                parent_id: {
                    type: String,
                },
            },
        ],
    },
    { timestamps: true },
);

const Comment = mongoose.model('comment', commentSchema);

export default Comment;
