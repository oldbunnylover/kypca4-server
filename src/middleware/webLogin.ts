import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            isWeb?: boolean
        }
    }
}

const webLogin = (req: Request, res: Response, next: NextFunction) => {
    req.isWeb = true;
    next();
};

export default webLogin;