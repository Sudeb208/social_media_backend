import { rmSync } from 'fs';
import Post from '../model/dbModel';
import React from '../model/likeModel';
import User from '../model/userModel';

//post like
const postLike = async (req: any, res: any) => {
    try {
        const { post_id, isPost, like } = req.body;
        console.log(req.body.post_id);

        console.log(req.user._id);

        //find post if post exit then create or update new like model
        if (isPost) {
            const post = await Post.findById({ _id: post_id });
            if (post) {
                // finding post in like data base
                const isReact = await React.findOne({ post_id });

                //if Post's like collection exit then update like collection
                if (isReact) {
                    const isLiked = await isReact.React.filter(
                        (data: any) => data.user_id == req.user._id,
                    );
                    console.log(isLiked);
                    if (isLiked.length > 0) {
                        const data = await React.updateOne(
                            {
                                post_id,
                                'React._id': isLiked[0]._id,
                            },
                            { $pull: { React: { _id: isLiked[0]._id } } },
                        );
                        if (data) {
                            return res.status(200).json({ data });
                        }
                    }
                    const createNewReact = await React.findOneAndUpdate(
                        { post_id },
                        {
                            $push: {
                                React: {
                                    like: like,
                                    user_id: req.user._id,
                                },
                            },
                        },
                        { new: true },
                    );
                    if (createNewReact) {
                        return res.status(201).json({ createNewReact });
                    }
                }
                //if if Post's like collection not exit then create new collection
                else {
                    const obj = {
                        post_id,
                        isPost,
                        React: { like: like, user_id: req.user._id },
                    };
                    const likeData = new React(obj);
                    likeData.save(async (error: any, data: any) => {
                        if (error) {
                            return res.status(500).json({ error: error });
                        }
                        if (data) {
                            console.log(data);

                            const addReactId = await Post.findOneAndUpdate(
                                { _id: post_id },
                                { react_id: data._id },
                            );
                            console.log(addReactId);

                            return res.status(201).json({ data });
                        }
                    });
                }
            }
        } else {
            res.status(500).json({ error: 'unkown error' });
            console.log('unknown error');
        }
    } catch (error) {
        if (error) {
            res.status(500).json({ error: error });
        }
        console.log(error);
    }
};
//end post like

//count like
const CountLike = async (req: any, res: any) => {
    try {
        const { post_id } = req.body;

        if (post_id) {
            const react = await React.findOne({ post_id });
            if (react) {
                const countReact = react.React.length;
                return res.status(200).json({ countReact });
            }
        } else {
            res.status(404).json({ error: 'plz insart the post id' });
        }
    } catch (error) {
        res.status(500).json({ error: error });
        console.log(error);
    }
};

const getLikerPerson = async (req: any, res: any) => {
    try {
        const { post_id } = req.body;
        if (post_id) {
            const react = await React.findOne({ post_id })
                .select('React.user_id')
                .populate(
                    'React.user_id',
                    '_id email fristName lastName profileImage',
                );
            if (react) {
                const countReact = react;
                return res.status(200).json({ countReact });
            }
        } else {
            res.status(404).json({ error: 'plz insart the post id' });
        }
    } catch (error) {
        res.status(500).json({ error: error });
        console.log(error);
    }
};
export { postLike, CountLike, getLikerPerson };
