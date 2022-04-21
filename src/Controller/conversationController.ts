import { rmSync } from 'fs';
import Conversation from '../model/ConversationModel';

const createConversation = async (req: any, res: any) => {
    try {
        const { user_id, sender_id } = req.body;
        console.log(user_id);
        const datas = await Conversation.find({
            messagerId: { $in: [user_id, sender_id] },
        }).populate({ path: 'messagerId', select: 'fristName' });
        const newData = await datas.find((value, index) => {
            // console.log(value.messagerId);

            return (
                (value.messagerId[0]?._id == user_id &&
                    value.messagerId[1]?._id == sender_id) ||
                (value.messagerId[0]?._id == sender_id &&
                    value.messagerId[1]?._id == user_id)
            );
        });
        if (newData) {
            return res
                .status(500)
                .json({ msg: 'user conversation allready exit' });
        } else {
            const conversation = new Conversation({
                messagerId: [user_id, sender_id],
            });
            const data = await conversation.save();

            res.status(201).json({ data });
        }
    } catch (error) {
        console.log(error);
    }
};

const getConversation = async (req: any, res: any) => {
    try {
        const { user_id, sender_id } = req.body;
        const data = await Conversation.find({
            messagerId: { $in: [user_id, sender_id] },
        }).populate({ path: 'messagerId', select: 'fristName' });
        const newData = await data.find((value, index) => {
            // console.log(value.messagerId);

            return (
                (value.messagerId[0]?._id == user_id &&
                    value.messagerId[1]?._id == sender_id) ||
                (value.messagerId[0]?._id == sender_id &&
                    value.messagerId[1]?._id == user_id)
            );
        });
        console.log(newData);

        res.status(200).json({ data });
    } catch (error) {
        console.log(error);
    }
};

export { createConversation, getConversation };
