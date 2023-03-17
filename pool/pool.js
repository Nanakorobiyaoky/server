'use strict';

const {Pool} = require('pg');

const HOST = 'localhost';
const PORT = 5432;
const DATABASE = 'server';
const USER = 'postgres';
const PASSWORD = 'Vftyjnbgh7766.';

const pool = new Pool({
    user: USER,
    password: PASSWORD,
    host: HOST,
    port: PORT,
    database: DATABASE,
    max: 10,
})

module.exports = {
    pool,

}