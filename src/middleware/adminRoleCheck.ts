import { Request, Response, NextFunction } from 'express';

const adminRoleCheck = (req: Request, res: Response, next: NextFunction) => {
    if (['admin'].includes(res.locals.jwt.role)) {
        next();
    } else {
        return res.status(403).json();
    }
};

export default adminRoleCheck;
