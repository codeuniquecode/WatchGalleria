const {Sequelize, DataTypes, HasMany, HasOne} = require('sequelize');
const dbConfig = require('../config/dbConfig');
const makeUserTable = require('./userModel');
const makeVendorTable = require('./vendorModel');
const makeCategoryTable = require('./categoryModel');
const makeProductTable = require('./productModel');

const {host} = dbConfig;

    const sequelize = new Sequelize('watchgalleria','root','',{
    host: host,
    port:3306,
    dialect :'mysql',
    pool:{
        max:10,
        min:0,
        acquire:30000,
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
db.category = makeCategoryTable(sequelize,DataTypes);
db.product = makeProductTable(sequelize,DataTypes);

// Vendor-Product relationship
db.vendor.hasMany(db.product, {
    foreignKey: 'vendorId' // Specify the foreign key name
  });
  db.product.belongsTo(db.vendor, {
    foreignKey: 'vendorId' 
  });
  
  // Category-Product relationship
  db.category.hasMany(db.product, {
    foreignKey: 'categoryId' 
  });
  db.product.belongsTo(db.category, {
    foreignKey: 'categoryId' 
  });
  
db.sequelize.sync({force:false}).then(()=>{
    console.log('sync done');
})
module.exports = db;