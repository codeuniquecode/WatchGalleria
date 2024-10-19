const {Sequelize, DataTypes, HasMany, HasOne} = require('sequelize');
const dbConfig = require('../config/dbConfig');
const makeUserTable = require('./userModel');
const makeVendorTable = require('./vendorModel');
const makeCategoryTable = require('./categoryModel');
const makeProductTable = require('./productModel');
const makeCartTable = require('./cartModel');
const { makeCartItemTable } = require('./cartItemModel');
const makeOrderTable = require('./orderModel');
const makeOrderItemTable = require('./orderItemModel');

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
db.cart = makeCartTable(sequelize,DataTypes);
db.cartItem = makeCartItemTable(sequelize,DataTypes);
db.order = makeOrderTable(sequelize,DataTypes);
db.orderItem = makeOrderItemTable(sequelize,DataTypes);
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

  // User-Cart relationship
db.user.hasOne(db.cart, {
    foreignKey: 'userId' 
  });
  db.cart.belongsTo(db.user, {  
    foreignKey: 'userId' 
  });

  // Cart-cartItem relationship
  db.cart.hasMany(db.cartItem, {
    foreignKey: 'cartId' 
  });
  db.cartItem.belongsTo(db.cart, {
    foreignKey: 'cartId' 
  });

  // Product-cartItem relationship
  db.product.hasMany(db.cartItem, {
    foreignKey: 'productId' 
  });
  db.cartItem.belongsTo(db.product, {
    foreignKey: 'productId' 
  });

  // User-Order relationship
  db.user.hasMany(db.order, {
    foreignKey: 'userId' 
  });
  db.order.belongsTo(db.user, {
    foreignKey: 'userId'
  });

  // Order-OrderItem relationship
  db.order.hasMany(db.orderItem, {
    foreignKey: 'orderId' 
  });
  db.orderItem.belongsTo(db.order, {
    foreignKey: 'orderId' 
  });
  
  // Product-OrderItem relationship
  db.product.hasMany(db.orderItem, {
    foreignKey: 'productId' 
  });
  db.orderItem.belongsTo(db.product, {
    foreignKey: 'productId' 
  });
db.sequelize.sync({force:false}).then(()=>{
    console.log('sync done');
})
module.exports = db;