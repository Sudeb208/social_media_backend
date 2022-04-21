import mongoose from 'mongoose';
import Comment from '../model/commentModel';
import Post from '../model/dbModel';

//comment create
const createComment = async (req: any, res: any) => {
    try {
        const { post_id, comment, parent_id } = req.body;

        const user_id = req.user._id;

        const commentData = await Comment.findOne({ post_id });

        // if post of comment section allready exit then push new comment
        if (commentData) {
            const createNewComment = await Comment.findOneAndUpdate(
                { post_id },
                {
                    $push: {
                        comment: {
                            mainComment: comment,
                            user_id,
                            parent_id,
                            date: Date.now(),
                        },
                    },
                },
                { new: true },
            );
            if (createNewComment) {
                return res.status(201).json({ createNewComment });
            }
        }

        // end of pushing new comment

        // if comment section not exit then createComment seaction
        const commentObj = {
            post_id,
            comment: { mainComment: comment, user_id, date: Date.now() },
        };
        const createComment = new Comment(commentObj);
        createComment.save(async (error: any, data: any) => {
            if (error) {
                return res.status(500).json({ error });
            }
            if (data) {
                const addCommentIdToPost = await Post.findByIdAndUpdate(
                    { _id: post_id },
                    { comment_id: data._id },
                );
                console.log(addCommentIdToPost);

                return res.status(500).json({ data });
            }
        });
        // end of create new section
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};
//end of comment create

// create comment list
const createCommentList = (comments: any, parentId?: any): any => {
    const commentList = [];
    let comment;
    if (parentId == undefined || parentId == '') {
        comment = comments.filter(
            (cat: any) => cat.parent_id == '' || cat.parent_id == undefined,
        );
        console.log('undefine' + comment);
    }
    if (parentId) {
        comment = comments.filter((cat: any) => cat.parent_id == parentId);
    }
    for (let commt of comment) {
        commentList.push({
            _id: commt._id,
            user_id: commt.user_id,
            parent_id: commt.parent_id,
            comment: commt.mainComment,
            date: commt.date,
            replyComment: createCommentList(comments, commt._id),
        });
    }
    return commentList;
};
//get comment
const getComment = async (req: any, res: any) => {
    try {
        const { post_id } = req.body;
        const comments = await Comment.findOne({ post_id }).populate({
            path: 'comment.user_id',
            select: 'fristName',
        });
        if (comments) {
            const commentList = createCommentList(comments.comment);
            return res.status(200).json({ data: commentList });
        } else {
            res.status(500).json({ error: 'comment not found' });
        }
    } catch (error) {
        res.status(500).json({ error });
        console.log(error);
    }
};
// end of get comment

//reply comment
const replyComment = async (req: any, res: any) => {
    try {
        const { post_id, replyComment, parent_id } = req.body;

        const user_id = req.user._id;
        // const post = await Comment.findOne({ $name: { fristName: 'sudeb' } });
        const Post = await Comment.findOne({ post_id });
        if (Post) {
            console.log('find post');
            const parentComment = await Post.comment.findOne({
                _id: parent_id,
            });
            console.log(parent_id);

            if (parentComment) {
                const pushComment = await Comment.findOneAndUpdate(
                    { post_id },
                    {
                        $push: {
                            comment: {
                                mainComment: replyComment,
                                user_id,
                                parent_id,
                                date: Date.now(),
                            },
                        },
                    },
                );
                return res.status(201).json({ pushComment });
            } else {
                return res.status(200).json({ msg: 'something went worng' });
            }

            //     console.log(findComments[0].comment);
            //     if (findComments.length > 0) {
            //         console.log('comment exit');
            //         const parent: any = mongoose.model('comment');
            //         const Parent = new parent();
            //         console.log(Parent._id);

            //         Comment.findOne(
            //             {
            //                 comment: { _id: comment_id },
            //             },
            //             (err: any, data: any) => {
            //                 if (err) {
            //                     console.log(err);
            //                     console.log('error');
            //                 }
            //                 if (data) {
            //                     console.log(data);
            //                     console.log('data');
            //                 }
            //             },
            //         );

            // console.log(' replyu' + createNewReplyComment);
            // }

            // const findComment = await Comment.findOne({
            //     comment: { _id: comment_id },
            // });
            // console.log(findComment);
            // if (findComment) {
            //     return res.status(500).json({ msg: findComment });
            // }
        }
    } catch (error) {}
};
// end of reply comment

// update comment
const updateComment = async (req: any, res: any) => {
    try {
        const { user_id, post_id, comment_id, newComment } = req.body;
        console.log(post_id, comment_id, newComment);

        const post = await Comment.findOne({ post_id });
        if (post) {
            const filtered = post.comment.filter(
                (posts: any) => posts._id == comment_id,
            );
            console.log(filtered);
            if (filtered[0].user_id == user_id) {
                Comment.updateOne(
                    { post_id, 'comment._id': comment_id },
                    { $set: { 'comment.$.mainComment': newComment } },
                    (err: any, data: any) => {
                        if (err) {
                            console.log(err);
                            return res.status(200).json({ err });
                        }
                        if (data) {
                            return res.status(200).json({ data });
                        }
                    },
                );
            } else {
                return res.status(500).json({ error: 'acess denite' });
            }
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// deleteComment
const deleteComment = async (req: any, res: any) => {
    try {
        const { user_id, post_id, comment_id } = req.body;
        const post = await Comment.findOne({ post_id });
        if (post) {
            const filtered = post.comment.filter(
                (posts: any) => posts._id == comment_id,
            );

            if (filtered[0].user_id == user_id) {
                Comment.updateOne(
                    { post_id, 'comment._id': comment_id },
                    { $pull: { comment: { _id: comment_id } } },
                    (err: any, data: any) => {
                        if (err) {
                            console.log(err);
                            return res.status(200).json({ err });
                        }
                        if (data) {
                            return res.status(200).json({ data });
                        }
                    },
                );
            } else {
                return res.status(500).json({ error: 'acess denite' });
            }
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
// deleteComment end

export {
    createComment,
    getComment,
    replyComment,
    updateComment,
    deleteComment,
};
