import Comment from '../model/commentModel';
import Post from '../model/dbModel';
import React from '../model/likeModel';

const createPost = (req: any, res: any) => {
    const { caption } = req.body;
    const user_id = req.user._id;
    console.log(req.user);
    console.log(req.file);

    // let postpicture;

    // if (req.files.length > 0) {
    //     postpicture = req.files.map((file: any) => ({
    //         img: file.filename,
    //     }));
    // }

    //create comment  senction

    const newPost = new Post({
        caption,
        image: { img: req.file.filename },
        user_id,
    });
    newPost.save((error: any, data: any) => {
        if (error) {
            return res.status(500).json({
                message: error,
            });
        }
        if (data) {
            const commentObj = {
                post_id: data._id,
            };
            const createComment = new Comment(commentObj);
            createComment.save(async (error: any, data: any) => {
                if (error) {
                    return res.status(500).json({ error });
                }
                if (data) {
                    console.log(data);

                    //add comment section for posts
                    const addCommentIdToPost = await Post.findByIdAndUpdate(
                        { _id: data.post_id },
                        { comment_id: data._id },
                    );
                    // end add comment section

                    // add like section
                    const obj = {
                        post_id: data.post_id,
                        isPost: true,
                        // React: { like: like, user_id },
                    };
                    const likeData = new React(obj);
                    likeData.save(async (error: any, data: any) => {
                        if (error) {
                            return res.status(500).json({ error: error });
                        }
                        if (data) {
                            console.log(data);

                            const addReactId = await Post.findOneAndUpdate(
                                { _id: data.post_id },
                                { react_id: data._id },
                            );
                            console.log(addReactId);

                            return res.status(201).json({ data });
                        }
                    });
                    console.log(addCommentIdToPost);
                }
            });
            return res.status(201).json({
                post: data,
            });
        }
    });
};

const getPost = async (req: any, res: any) => {
    try {
        console.log(req.location);
        console.log(req.user);

        const posts = await Post.find({}).populate([
            'user_id',
            'react_id',
            'comment_id',
        ]);
        console.log(posts);

        res.status(200).json({ posts: posts.reverse() });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const deletePost = async (req: any, res: any) => {
    try {
        const { _id } = req.user;
        const { post_id } = req.body;
        const findPostAndDelete = await Post.findOneAndDelete({
            _id: post_id,
            user_id: _id,
        });
        if (findPostAndDelete) {
            return res.status(201).json({ findPostAndDelete });
        } else {
            return res.status(201).json({ error: 'post not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export { createPost, getPost, deletePost };
