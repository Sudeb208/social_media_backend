import jwt from 'jsonwebtoken';
const requireSignin = async (req: any, res: any, next: any) => {
    try {
        const header = await req.headers.authorization;
        console.log('header', header);

        if (header) {
            const token = header.split(' ')[1];
            console.log(token);

            const user = jwt.verify(
                token,
                '$2a$04$tAYABvH1OvkTgNyutEULseaZF4N9Ypp75HTdo6LBSLZsU62I9Fxe6',
            );

            req.user = user;
            req.token = token;
        } else {
            return res.status(500).json({ error: 'you need to sign up frist' });
        }
    } catch (error: any) {
        res.status('500').json({
            message: error.message,
        });
    }
    next();
};

export { requireSignin };
