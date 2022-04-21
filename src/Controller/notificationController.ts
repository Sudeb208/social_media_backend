import Notification from '../model/notifationModel';
import sendNotification from '../utilits/pushNotification';

const createNotification = async (req: any, res: any) => {
    try {
        const { user_id, name } = req.body;
        const data = await sendNotification(name, user_id);
        console.log('datas' + data);

        if (data) {
            res.status(200).json({ data });
        }
        // const notification = await Notification.findOne({ user_id });
        // if (notification) {
        //     //push new notification
        //     const pushNotication = await Notification.findOneAndUpdate(
        //         {
        //             user_id,
        //         },
        //         {
        //             $push: {
        //                 notification: {
        //                     name,
        //                 },
        //             },
        //         },
        //     );
        //     if (pushNotication) {
        //         return res.status(200).json({ notification: pushNotication });
        //     }
        // } else {
        //     const notification = new Notification({
        //         user_id,
        //         notification: { name },
        //     });
        //     await notification.save((error: any, data: any) => {
        //         if (error) {
        //             return res.status(500).json({ error });
        //         }
        //         if (data) {
        //             return res.status(200).json({ data });
        //         }
        //     });
        // }
    } catch (error) {
        res.status(500).json({ error });
    }
};

const getNotification = async (req: any, res: any) => {
    try {
        const { user_id } = req.body;
        const notification = await Notification.findOne({ user_id }).select(
            'notification',
        );
        if (notification) {
            return res.status(200).json({ notification });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};

export { createNotification, getNotification };
