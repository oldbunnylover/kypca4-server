import express from 'express';
import config from './config/config';
import userRoutes from './routes/user';
import bookRoutes from './routes/book';
import fileUpload from 'express-fileupload';
import extractJWT from './middleware/extractJWT';

const app = express();

app.use(express.json());
app.use(fileUpload());

app.use('/user', userRoutes);
app.use('/book', bookRoutes);

app.use('/books', express.Router().get('/:file', extractJWT, express.static('books')));
app.use('/covers', express.Router().get('/:file', extractJWT, express.static('books/covers')));

app.listen(config.server.port);