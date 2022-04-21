import { profile } from 'console';
import mongoose from 'mongoose';

const intence = new mongoose.Schema(
    {
        fristName: {
            type: String,
            required: true,
        },
        middleName: {
            type: String,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
        },
        phoneNumber: {
            type: Number,
        },
        password: {
            type: String,
            required: true,
        },
        profileImage: [{ img: { type: String } }],
        Bio: String,
        userName: {
            type: String,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        tokens: [
            {
                deviceName: { type: String },
                token: { type: String },
                login_At: { type: Date, default: Date.now() },
            },
        ],
    },

    {
        timestamps: true,
    },
);

const User = mongoose.model('User', intence);

export default User;
