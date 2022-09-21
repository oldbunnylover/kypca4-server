import {IMain, IDatabase} from 'pg-promise';
import pgPromise from 'pg-promise';

const SERVER_PORT = 3000;
const SERVER_TOKEN_ISSUER = 'libraryServerIssuer';
const SERVER_TOKEN_SECRET = 'swag';

const SERVER = {
    port: SERVER_PORT,
    token: {
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_TOKEN_SECRET
    }
};

const PG_HOST = 'localhost';
const PG_PORT = '5432';
const PG_DATABASE = 'DuckLibrary';
const PG_USER = 'postgres';
const PG_PASS = '4556776';

var pgp:IMain = pgPromise({});

var connection : string = `postgres://${PG_USER}:${PG_PASS}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}`;

var db : IDatabase<any> = pgp(connection);

const config = {
    server: SERVER,
    db: db
};

export default config;
