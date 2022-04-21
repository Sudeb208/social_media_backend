import mongoose from 'mongoose';

const passwordSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    token: { required: true, type: Number },
    isValidToken: {
        type: Boolean,
        default: false,
    },
});

const ForgotPass = mongoose.model('passwordToken', passwordSchema);

export default ForgotPass;
