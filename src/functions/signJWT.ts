import jwt from 'jsonwebtoken';
import config from '../config/config';
import IUser from '../interfaces/user';

const signJWT = (user: IUser, callback: (error: Error | null, token: string | null) => void): void => {
    try {
        jwt.sign(
            {
                username: user.username,
                role: user.role,
                blocked: user.blocked,
            },
            config.server.token.secret,
            {
                issuer: config.server.token.issuer,
                algorithm: 'HS256',
            },
            (error, token) => {
                if (error) {
                    callback(error, null);
                } else if (token) {
                    callback(null, token);
                }
            }
        );
    } catch (error) {
        callback(error as Error, null);
    }
};

export default signJWT;
