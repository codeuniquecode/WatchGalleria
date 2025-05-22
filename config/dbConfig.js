require('dotenv').config();

const databaseConfig = {

    dbase: process.env.DB,
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    port:54014,
    dialet:'mysql'
}

module.exports = databaseConfig;