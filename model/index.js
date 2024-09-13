const {Sequelize, DataTypes} = require('sequelize');
const dbConfig = require('../config/dbConfig');


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

module.exports = sequelize;