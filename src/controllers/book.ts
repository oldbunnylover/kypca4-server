import { NextFunction, Request, Response } from "express";
import fileUpload from 'express-fileupload';
import config from "../config/config";

const upload = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.files || !req.files.cover || !req.files.book) {
        return res.status(400).json({
            message: 'No files',
        });
    }

    let { name, description } = req.body;
    let genreIds : number[] = JSON.parse(req.body.genreIds);
    try {
        let cover = (req.files.cover as fileUpload.UploadedFile);
        let book = (req.files.book as fileUpload.UploadedFile);

        if (cover.mimetype.split('/')[0] != 'image') {
            console.log(cover.mimetype);
            console.log(book.mimetype);
            return res.status(400).json({
                message: 'Incorrect files format',
            });
        }
    
        let result = await config.db.func('create_book', [name, res.locals.jwt.username, description ?? '', genreIds]);

        let bookId : number = result[0].create_book;

        await cover.mv(`./books/covers/${bookId}.png`);
    
        await book.mv(`./books/${bookId}.epub`);
    
        return res.status(201).json();
    }
    catch(error) {
        return res.status(500).json({
            error
        });
    }
}

const getGenres = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let result = await config.db.func('get_genres', []);

        return res.status(200).json({
            genres: result
        });
    }
    catch(error) {
        return res.status(500).json({
            error
        });
    }
}

const remove = async (req: Request, res: Response, next: NextFunction) => {
    let { bookId } = req.body;

    try {
        await config.db.proc('remove_book', [bookId]);

        return res.status(200).json();
    }
    catch(error) {
        return res.status(500).json({
            error
        });
    }
}

const apply = async (req: Request, res: Response, next: NextFunction) => {
    let { bookId } = req.body;

    try {
        await config.db.proc('apply_book', [bookId]);

        return res.status(200).json();
    }
    catch(error) {
        return res.status(500).json({
            error
        });
    }
}

const rate = async (req: Request, res: Response, next: NextFunction) => {
    let { bookId, rate } = req.body;

    try {
        await config.db.proc('rate_book', [res.locals.jwt.username, bookId, rate]);

        return res.status(200).json();
    }
    catch(error) {
        return res.status(500).json({
            error
        });
    }
}

const addToFavorites = async (req: Request, res: Response, next: NextFunction) => {
    let { bookId } = req.body;

    try {
        await config.db.proc('save_book', [res.locals.jwt.username, bookId]);

        return res.status(200).json();
    }
    catch(error) {
        return res.status(500).json({
            error
        });
    }
}

const removeFromFavorites = async (req: Request, res: Response, next: NextFunction) => {
    let { bookId } = req.body;

    try {
        await config.db.proc('unsave_book', [res.locals.jwt.username, bookId]);

        return res.status(200).json();
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            error
        });
    }
}

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let result = await config.db.func('get_all_books', [res.locals.jwt.username]);

        return res.status(200).json({
            books: result
        });
    }
    catch(error) {
        return res.status(500).json({
            error
        });
    }
}

const edit = async (req: Request, res: Response, next: NextFunction) => {

}

export default { upload, getGenres, getAll, remove, apply, edit, rate, addToFavorites, removeFromFavorites };