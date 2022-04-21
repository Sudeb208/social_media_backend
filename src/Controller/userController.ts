import User from '../model/userModel';
import bcrypt from 'bcrypt';
import shortid, { isValid } from 'shortid';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import TokenModel from '../model/userTokenModel';
import sendEmail from '../utilits/email';
import ForgotPass from '../model/passwordTokenModel';

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
        user.save(async (error: object, data: any) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error });
            }
            if (data) {
                console.log(data);

                const token = crypto.randomBytes(32).toString('hex');
                console.log(token);

                const tokenData = new TokenModel({
                    user_id: data._id,
                    token,
                });
                tokenData.save(async (error: any, data: any) => {
                    if (error) {
                        return res.status(500).json(error);
                    }
                    if (data) {
                        const text = 'verifiy the email';
                        const subject = 'email verifiy';
                        const body = `http://localhost:4001/api/user/account/verifiy/${data.user_id}/${data.token}`;
                        await sendEmail(email, subject, text, body);
                        return res.status(201).json({ data });
                    }
                });
            }
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({ error });
    }
};

//verifiy token
const verifiyToken = async (req: any, res: any) => {
    try {
        const { user_id, token } = req.params;
        console.log(user_id, token);
        const data = await TokenModel.findOneAndRemove({
            user_id: user_id,
            token,
        });
        if (data) {
            await User.findOneAndUpdate({ _id: user_id }, { isVerified: true });
            res.status(200).send('verified sucessfully');
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};

const resendToken = async (req: any, res: any) => {
    try {
        const { user_id, email } = req.body;
        const data = await TokenModel.findOne({ user_id });
        if (data) {
            const text = 'verifiy the email';
            const subject = 'email verifiy';
            const body =
                '<button> ><a href=`http://localhost:4001/api/user/account/verifiy/${data.user_id}/${data.token}` > Verify</a></button>';
            await sendEmail(email, subject, text, body);
            return res.status(201).json({ data });
        } else {
            return res.status(500).json({ error: 'not found token' });
        }
    } catch (error) {
        res.status(500).json({ error: error });
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
                await User.findOneAndUpdate(
                    { _id },
                    {
                        $push: {
                            tokens: {
                                deviceName: 'pc',
                                token,
                            },
                        },
                    },
                );
                res.cookie('token', token, { expiresIn: '1d' });
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

//change password
const changePassword = async (req: any, res: any) => {
    try {
        const { user_id, password, newPassword } = req.body;
        const data = await User.findOne({ _id: user_id });
        if (data) {
            const isValidPassword = await bcrypt.compare(
                password,
                data.password,
            );
            if (isValidPassword) {
                const password = await bcrypt.hash(newPassword, 10);
                const data = await User.findOneAndUpdate(
                    { _id: user_id },
                    { password },
                );
                if (data) {
                    await sendEmail(
                        data.email,
                        'password change',
                        'your password ',
                        '<p> your password has changed if you are not changing password <button><a>click here</a></button></p>',
                    );
                    return res.status(200).json({ data });
                }
            } else {
                return res.status(500).json({ msg: 'password not matching' });
            }
        } else {
            res.status(500).json({ error: 'user not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
//end change password

//forgot password
interface Req {
    body: {
        email: string | any;
        userName: string;
    };
}
const forgotPasswordRequest = async (req: Req, res: any) => {
    try {
        const { email } = req.body;
        const findEmail = await User.findOne({ email }).select(
            'fristName lastName profileImage',
        );
        if (findEmail) {
            const code: any = Math.floor(1000 + Math.random() * 9000);

            await new ForgotPass({ email: email, token: code }).save();
            await sendEmail(
                email,
                'password code',
                'change your password with this code',
                `your code ${code}`,
            );
            return res.status(200).json({ msg: 'otp sent to your gmail' });
        } else {
            res.status(500).json({ error: 'cant find user' });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};

const isValidCode = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { code } = req.body;
        const userToken = await ForgotPass.findOne({ user_id: id });
        if (userToken.token == code) {
            await ForgotPass.findOneAndUpdate(
                { _id: userToken._id },
                { isValidToken: true },
            );
            res.status(200).json({ msg: userToken });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};
const forgotPassword = async (req: any, res: any) => {
    try {
        const { user_id } = req.params;
        const { password } = req.body;
        const user = await User.findOne({ _id: user_id });
        if (user) {
            const isValidCode = await ForgotPass.findOne({ user_id });
            if (isValidCode.isValidToken) {
                const hashPassword = await bcrypt.hash(password, 10);
                await User.findOneAndUpdate(
                    { _id: user_id },
                    { password: hashPassword },
                );
                await ForgotPass.findByIdAndRemove({ user_id });
                return res.status(200).json({ msg: 'password updated' });
            }
        } else {
            res.status(500).json({ error: 'something went worng' });
        }
    } catch (error) {
        res.status(500).json({ error });
        console.log(error);
    }
};

const signOut = async (req: any, res: any) => {
    try {
        console.log('token', req.token);
        console.log(req.user);
        const user = req.user;
        const removeToken = await User.findOneAndUpdate(
            {
                _id: user._id,
                'tokens.token': req.token,
            },
            { $pull: { tokens: { token: req.token } } },
        );
        if (removeToken) {
            res.clearCookie('token');
            return res.status(200).json({ removeToken });
        } else {
            return res.status(200).json({ hello: 'hello' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
};
export {
    createUser,
    loginUser,
    GoogleAuthentication,
    verifiyToken,
    resendToken,
    changePassword,
    forgotPasswordRequest,
    isValidCode,
    signOut,
};
