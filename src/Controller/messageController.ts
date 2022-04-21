import Message from '../model/messageModel';

//createMessage
const createMessage = async (req: any, res: any) => {
    try {
        const { conversationId, sender_id, receiver_id, message } = req.body;
        const data = await new Message({
            conversationId,
            sender_id,
            receiver_id,
            message,
        }).save();
        res.status(200).json({ data });
    } catch (error) {
        console.log(error);
    }
};
//end of create message

//get message by conversation Id
async function getMessage(req: any, res: any) {
    try {
        const { conversationId } = req.body;
        const message = await Message.find({ conversationId });
        return res.status(200).json({ message });
    } catch (error: any) {
        return res.status(200).json({ error: error.message });
    }
}
//end of get message

export { createMessage, getMessage };
