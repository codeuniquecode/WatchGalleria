require('dotenv').config();

const databaseConfig = {

    db: process.env.DB,
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    port:3306,
    dialet:'mysql'
}

module.exports = databaseConfig;