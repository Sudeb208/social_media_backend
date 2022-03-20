import User from '../model/userModel';
import bcrypt from 'bcrypt';
import shortid from 'shortid';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import TokenModel from '../model/userTokenModel';

const clilent = new OAuth2Client(
    '94919188802-ep83a04etua7hnf8pm7fprgj8vpq6512.apps.googleusercontent.com',
);

//create or sign up user
const createUser = async (req: any, res: any) => {
    try {
        console.log(req.file.filename);
        const {
            fristName,
            middleName,
            lastName,
            password,
            email,
            phoneNumber,
        } = req.body;

        const hashPassword = await bcrypt.hash(password, 10);
        const oldUser = await User.findOne({ email: email });
        console.log({ oldUser });
        if (oldUser) {
            return res.status(500).json({ msg: 'user allready exits' });
        }
        const objectUser = {
            fristName,
            middleName,
            lastName,
            password: hashPassword,
            email,
            phoneNumber,
            profileImage: { img: req.file.filename },
            userName: fristName + shortid.generate(),
        };
        const user = new User(objectUser);
        user.save((error: object, data: any) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error });
            }
            if (data) {
                const token_id = crypto;
                const tokenData = new TokenModel({
                    user_id: data._id,
                    token_id,
                });
                // await TokenModel.Save();
                return res.status(201).json({ data });
            }
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({ error });
    }
};

// login user
const loginUser = async (req: any, res: any) => {
    try {
        const { email, password, phoneNumber } = req.body;

        const user: any = await User.findOne({ email });
        if (user) {
            const isValidPassword = await bcrypt.compare(
                password,
                user.password,
            );
            if (isValidPassword) {
                const {
                    _id,
                    fristName,
                    lastName,
                    middleName,
                    email,
                    role,
                    userName,
                } = user;
                // const sceret: string = process.env.JWTCODE
                const token = jwt.sign(
                    {
                        _id,
                        fristName,
                        lastName,
                        middleName,
                        email,
                        role,
                        userName,
                    },
                    '$2a$04$tAYABvH1OvkTgNyutEULseaZF4N9Ypp75HTdo6LBSLZsU62I9Fxe6',
                    { expiresIn: '7d' },
                );
                return res.status(200).json({
                    token,
                    user: {
                        _id,
                        fristName,
                        lastName,
                        middleName,
                        email,
                        role,
                        userName,
                    },
                });
            } else {
                return res.status(500).json({ error: 'something went worng' });
            }
        } else {
            return res.status(500).json({ error: 'something went worng' });
        }
    } catch (error) {
        res.status(500).json({ error });
        console.log(error);
    }
};
//end login user

//login with google
const GoogleAuthentication = async (req: any, res: any) => {
    try {
        const { tokenId } = req.body;
        clilent
            .verifyIdToken({
                idToken: tokenId,
                audience:
                    '94919188802-ep83a04etua7hnf8pm7fprgj8vpq6512.apps.googleusercontent.com',
            })
            .then(async (response: any) => {
                interface respnses {
                    email_verfied: string;
                    name: string;
                    email: string;
                    LoginTicket: string;
                    family_name: string;
                    given_name: string;
                    picture: string;
                }
                if (response) {
                    const {
                        email_verfied,
                        name,
                        email,
                        family_name,
                        given_name,
                        picture,
                    }: respnses = response.payload;
                    console.log(response.payload);
                    const user = await User.findOne({ email });
                    if (user) {
                        const {
                            _id,
                            fristName,
                            lastName,
                            middleName,
                            email,
                            role,
                            userName,
                        } = user;
                        // const sceret: string = process.env.JWTCODE
                        const token = jwt.sign(
                            {
                                _id,
                                fristName,
                                lastName,
                                middleName,
                                email,
                                role,
                                userName,
                            },
                            '$2a$04$tAYABvH1OvkTgNyutEULseaZF4N9Ypp75HTdo6LBSLZsU62I9Fxe6',
                            { expiresIn: '7d' },
                        );
                        return res.status(200).json({
                            token,
                            user: {
                                _id,
                                fristName,
                                lastName,
                                middleName,
                                email,
                                role,
                                userName,
                            },
                        });
                    } else if (!user) {
                        const genaretPassword = shortid.generate();
                        const hashPassword = await bcrypt.hash(
                            genaretPassword,
                            10,
                        );
                        const oldUser = await User.findOne({ email: email });
                        console.log({ oldUser });
                        if (oldUser) {
                            return res
                                .status(500)
                                .json({ msg: 'user allready exits' });
                        }
                        const objectUser = {
                            fristName: given_name,
                            lastName: family_name,
                            password: hashPassword,
                            email,
                            profileImage: { img: picture },
                            userName: given_name + shortid.generate(),
                        };
                        const user = new User(objectUser);
                        user.save((error: object, data: object) => {
                            if (error) {
                                console.log(error);
                                return res.status(500).json({ error });
                            }
                            if (data) {
                                console.log(data);
                                return res.status(500).json({ data });
                            }
                        });
                    }
                }
            })
            .catch(error => {
                console.log(error);

                return res.status(500).json({ error });
            });
        console.log(tokenId);
    } catch (error) {
        res.status(500).json({ error });
    }
};
//end login with google

export { createUser, loginUser, GoogleAuthentication };
