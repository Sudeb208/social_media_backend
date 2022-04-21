import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        notification: [
            {
                name: {
                    type: String,
                    required: true,
                },
                date: {
                    type: Date,
                    default: new Date(),
                },
            },
        ],
    },
    { timestamps: true },
);

const Notification = mongoose.model('notification', notificationSchema);

export default Notification;
