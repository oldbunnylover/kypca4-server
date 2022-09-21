import { Request, Response, NextFunction } from 'express';

const moderRoleCheck = (req: Request, res: Response, next: NextFunction) => {
    if (['admin', 'mod'].includes(res.locals.jwt.role)) {
        next();
    } else {
        return res.status(403).json();
    }
};

export default moderRoleCheck;
