import { Navigator } from 'node-navigator';

const navigator = new Navigator();

const getLocation = async (req: any, res: any, next: Function) => {
    try {
        var location;
        navigator.geolocation.getCurrentPosition((success, error) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error });
            } else {
                req.location = success;
            }
            next();
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};

export default getLocation;
