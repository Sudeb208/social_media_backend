import Post from '../model/dbModel';

const createPost = (req: any, res: any) => {
    const { caption } = req.body;
    const user_id = req.user._id;
    console.log(req.user);
    console.log(req.newUser);

    let postpicture;

    if (req.files.length > 0) {
        postpicture = req.files.map((file: any) => ({
            img: file.filename,
        }));
    }
    const newPost = new Post({ caption, image: postpicture, user_id });
    newPost.save((error: any, data: any) => {
        if (error) {
            return res.status(500).json({
                message: error,
            });
        }
        if (data) {
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
        res.status(200).json({ posts: posts });
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
