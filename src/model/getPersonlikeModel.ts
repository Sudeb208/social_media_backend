import mongoose from 'mongoose';

const PersonLikeSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    AllReacts: [
        {
            post_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'posts',
                required: true,
            },
        },
    ],
});

const PersonReact = mongoose.model('personReact', PersonLikeSchema);

export default PersonReact;
