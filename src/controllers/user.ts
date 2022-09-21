
import { NextFunction, Request, Response } from "express";
import bcryptjs from 'bcryptjs';
import signJWT from '../functions/signJWT';
import config from "../config/config";
import IUser from "../interfaces/user";

const register = (req: Request, res: Response, next: NextFunction) => {
    let { username, password, fullname } = req.body;
    bcryptjs.hash(password, 10, async (hashError, hash) => {
        if (hashError) {
            return res.status(500).json({
                message: hashError.message,
                error: hashError
            });
        }

        try {
            let users : IUser[] = await config.db.func<IUser[]>('create_user', [username, fullname, hash]);
            signJWT(users[0], (_error, token) => {
                if (_error) {
                    return res.status(500).json({
                        error: _error
                    });
                } else if (token) {
                    return res.status(200).json({
                        token,
                    });
                }
            });
        }
        catch(error) {
            return res.status(409).json({
                message: (error as Error).message,
                error
            });
        }
    });
}

const login = async (req: Request, res: Response, next: NextFunction) => {
    let { username, password } = req.body;

    try {
        let users : IUser[] = await config.db.func<IUser[]>('get_user_by_username', [username]);
        if (users.length === 0 || users[0].username === null) {
            return res.status(404).json();
        }
        
        if (req.isWeb === true && !['admin', 'mod'].includes(users[0].role)) {
            return res.status(404).json();
        }

        bcryptjs.compare(password, users[0].password, (error, result) => {
            if (!result || error) {
                return res.status(404).json();
            } else if (result) {
                signJWT(users[0], (_error, token) => {
                    if (_error) {
                        return res.status(500).json({
                            error: _error
                        });
                    } else if (token) {
                        return res.status(200).json({
                            token,
                        });
                    }
                });
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            message: (error as Error).message,
            error
        });
    }
}

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let users : IUser[] = await config.db.func<IUser[]>('get_user_by_username', [res.locals.jwt.username]);
        if (users.length === 0 || users[0].username === null) {
            return res.status(404).json();
        }
        return res.status(200).json({
            user: users[0]
        });
    } catch (error) {
        return res.status(500).json({
            message: (error as Error).message,
            error
        });
    }
}

const updateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let users : IUser[] = await config.db.func<IUser[]>('get_user_by_username', [res.locals.jwt.username]);
        if (users.length === 0 || users[0].username === null) {
            return res.status(404).json();
        }
        signJWT(users[0], (_error, token) => {
            if (_error) {
                return res.status(500).json({
                    error: _error
                });
            } else if (token) {
                return res.status(200).json({
                    token
                });
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: (error as Error).message,
            error
        });
    }
}

const changeUserEmail = async (req: Request, res: Response, next: NextFunction) => {
    let { email } = req.body;
    //TODO: подтверждение
    try {
        await config.db.proc('change_user_email', [res.locals.jwt.username, email])
        res.status(200).json();
    }
    catch (error) {
        return res.status(500).json({
            message: (error as Error).message,
            error
        });
    }
}

const changeUserPassword = async (req: Request, res: Response, next: NextFunction) => {
    let { password } = req.body;

    bcryptjs.hash(password, 10, async (hashError, hash) => {
        if (hashError) {
            return res.status(500).json({
                message: hashError.message,
                error: hashError
            });
        }

        try {
            await config.db.proc('change_user_password', [res.locals.jwt.username, hash])
            res.status(200).json();
        }
        catch (error) {
            return res.status(500).json({
                message: (error as Error).message,
                error
            });
        }
    });
}

const changeUserRole = async (req: Request, res: Response, next: NextFunction) => {
    let { username, role } = req.body;

    try {
        await config.db.proc('change_user_role', [username, role])
        res.status(200).json();
    }
    catch (error) {
        return res.status(500).json({
            message: (error as Error).message,
            error
        });
    }
}

const blockUser = async (req: Request, res: Response, next: NextFunction) => {
    let { username } = req.body;

    try {
        await config.db.proc('block_user', [username])
        res.status(200).json();
    }
    catch (error) {
        return res.status(500).json({
            message: (error as Error).message,
            error
        });
    }
}


export default { register, login, getUser, updateToken, changeUserEmail, changeUserPassword, changeUserRole, blockUser };