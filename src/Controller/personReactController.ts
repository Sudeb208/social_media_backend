import { rmSync } from 'fs';
import PersonReact from '../model/getPersonlikeModel';

//create person react
const createPersonReact = async (req: any, res: any) => {
    try {
        const { post_id } = req.body;
        console.log(req.user._id, 'post_id');

        const user_id = req.user._id;

        const isUser = await PersonReact.findOne({ user_id });

        // if user_id exist in data dase then update data
        if (isUser) {
            const isPostLiked = await PersonReact.findOne({
                user_id,
                'AllReacts.post_id': post_id,
            });

            //if post all ready has liked then remove post like
            if (isPostLiked) {
                const personPostLike = await PersonReact.findOneAndUpdate(
                    { user_id },
                    {
                        $pull: {
                            AllReacts: {
                                post_id,
                            },
                        },
                    },
                );
                return res.status(201).json({ personPostLike });
            }

            //if post not liked then push post id
            else {
                const personPostLike = await PersonReact.findOneAndUpdate(
                    { user_id },
                    {
                        $push: {
                            AllReacts: {
                                post_id,
                            },
                        },
                    },
                );
                return res.status(201).json({ personPostLike });
            }
        } else {
            const obj = {
                user_id,
                AllReacts: [{ post_id: post_id }],
            };
            const reactData = new PersonReact(obj);

            reactData.save((error: any, data: any) => {
                if (error) {
                    return res.status(500).json({ error });
                }
                return res.status(200).json({ data });
            });
        }
    } catch (error) {
        console.log(error);
    }
};

// get all person react
const getAllPersonReact = async (req: any, res: any) => {
    try {
        const user_id = req.user._id;

        const getPersonReact = await PersonReact.findOne({ user_id });
        if (getPersonReact) {
            return res.status(200).json({ getPersonReact });
        }
    } catch (error) {
        console.log(error);

        return res.status(500).json({ error });
    }
};

//get post react with person react

const getPostReactInPersonReact = async (req: any, res: any) => {
    try {
        const user_id = req.user._id;
        const { post_id } = req.body;

        const isPostId = await PersonReact.findOne({
            user_id,
            'AllReacts.post_id': post_id,
        });
        if (isPostId) {
            return res.status(200).json({ data: true });
        } else {
            console.log('send faild');
            return res.status(404).json({ data: false });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};

export { createPersonReact, getAllPersonReact, getPostReactInPersonReact };
