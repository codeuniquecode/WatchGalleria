const {Sequelize, DataTypes} = require('sequelize');
const dbConfig = require('../config/dbConfig');
const makeUserTable = require('./userModel');
const makeVendorTable = require('./vendorModel');


const {host} = dbConfig;

    const sequelize = new Sequelize('watchgalleria','root','',{
    host: host,
    port:3306,
    dialect :'mysql',
    pool:{
        max:5,
        min:0,
        acquire:3000,
        idle:10000
    
    }
});
sequelize.authenticate().then(()=>{
    console.log('milyo');
})
.catch((err)=>{
    console.log('error vayo',err);
})
const db ={}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.user = makeUserTable(sequelize,DataTypes);
db.vendor = makeVendorTable(sequelize,DataTypes);
db.sequelize.sync({force:false}).then(()=>{
    console.log('sync done');
})
module.exports = db;