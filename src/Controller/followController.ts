import Follow from '../model/followModel';

const createAndUpdateFollower = async (req: any, res: any) => {
    try {
        const { user_id, follower_id } = req.body;

        if (follower_id) {
            const followCollection = await Follow.findOne({ user_id });

            if (followCollection) {
                const isfollowed = await followCollection.follower.filter(
                    (data: any) => data.follower_id == follower_id,
                );
                console.log(isfollowed);

                if (isfollowed.length > 0) {
                    Follow.updateOne(
                        {
                            user_id,
                            'follower._id': isfollowed[0]._id,
                        },
                        { $pull: { follower: { _id: isfollowed[0]._id } } },
                        (error: any, data: any) => {
                            if (error) {
                                return res.status(500).json({ error });
                            } else {
                                return res.status(500).json({ data });
                            }
                        },
                    );
                } else {
                    const createNewFollower = await Follow.findOneAndUpdate(
                        { user_id },
                        {
                            $push: {
                                follower: {
                                    follower_id,
                                },
                            },
                        },
                        { new: true },
                    );
                    if (createNewFollower) {
                        return res.status(201).json({ createNewFollower });
                    }
                }
            } else {
                const obj = {
                    user_id,
                    follower: { follower_id },
                };
                const NewfollowerCollection = new Follow(obj);
                NewfollowerCollection.save((error: any, data: any) => {
                    if (error) {
                        return res.status(500).json({ error });
                    }
                    if (data) {
                        return res.status(201).json({ data });
                    }
                });
            }
        } else {
            return res.status(500).json({ error: 'follower_id not found' });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};

const getFollower = async (req: any, res: any) => {
    try {
        const { user_id } = req.body;
        const isfollowed = await Follow.findOne({ user_id })
            .select('follower.follower_id')
            .populate(
                'follower.follower_id',
                '_id fristName lastName email, profileImage',
            );
        if (isfollowed) {
            return res.status(200).json({ follower: isfollowed.follower });
        } else {
            return res.status(200).json({ follower: [] });
        }
    } catch (error) {
        res.status(500).json({ error });
        console.log(error);
    }
};

export { createAndUpdateFollower, getFollower };
