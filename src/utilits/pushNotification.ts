import Notification from '../model/notifationModel';

const sendNotification = async (msg: string, user_id: string) => {
    try {
        const notification = await Notification.findOne({ user_id });
        if (notification) {
            //push new notification
            const pushNotication = await Notification.findOneAndUpdate(
                {
                    user_id,
                },
                {
                    $push: {
                        notification: {
                            name: msg,
                        },
                    },
                },
            );
            if (pushNotication) {
                return pushNotication;
            }
        } else {
            const notification = new Notification({
                user_id,
                notification: { name: msg },
            });
            const data = await notification.save();
            if (data) {
                return data;
            }
        }
    } catch (error) {
        return error;
    }
};

export default sendNotification;
