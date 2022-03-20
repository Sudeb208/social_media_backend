import mongoose from 'mongoose';

// interface intance {
//     caption: string,
//     user: string,
//     image: {
//         data: string,
//         contentType: string
//     }
// }

const intance = new mongoose.Schema(
    {
        caption: {
            type: String,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        image: [{ img: { type: String } }],
        viewStatus: {
            type: String,
            enum: ['public', 'friends', 'friendsOfFriends'],
            default: 'public',
        },
        location: {
            type: String,
        },
        react_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'react',
        },
        comment_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comment',
        },
    },
    { timestamps: true },
);

const Post = mongoose.model('posts', intance);
export default Post;
