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
const makeNotificationTable = require('./notificationModel');

const {host} = dbConfig;

    const sequelize = new Sequelize('railway','root','btQBUtaDKrZYuaTUquXSPtqTzNPjWEOS',{
    host: host,
    port:29239,//3306 for local
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
db.notification = makeNotificationTable(sequelize,DataTypes);
// Vendor-Product relationship
db.vendor.hasMany(db.product, {
    foreignKey: 'vendorId', // Specify the foreign key name
    onDelete: 'CASCADE', // When vendor is deleted, related products will be deleted
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
    foreignKey: 'userId' ,
    onDelete: 'CASCADE', // When user is deleted, related cart will be deleted
  });
  db.cart.belongsTo(db.user, {  
    foreignKey: 'userId' 
  });

  // Cart-cartItem relationship
  db.cart.hasMany(db.cartItem, {
    foreignKey: 'cartId',
    onDelete: 'CASCADE' // When cart is deleted, related cart items will be deleted
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
    foreignKey: 'userId' ,
    onDelete: 'CASCADE', // When user is deleted, related orders will be deleted
  });
  db.order.belongsTo(db.user, {
    foreignKey: 'userId'
  });

  // Order-OrderItem relationship
  db.order.hasMany(db.orderItem, {
    foreignKey: 'orderId',
    onDelete: 'CASCADE' // When order is deleted, related order items will be deleted 
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

  //vendor-order relationship
  db.vendor.hasMany(db.order,{
      foreignKey:'vendorId'
  });
  db.order.belongsTo(db.vendor,{
      foreignKey:'vendorId'
  });

  //vendor-notification relationship
  db.vendor.hasMany(db.notification,{
      foreignKey:'vendorId',
      onDelete:'CASCADE'
  });
  db.notification.belongsTo(db.vendor,{
      foreignKey:'vendorId'
  });

  // //product-notification relationship
  // db.product.hasMany(db.notification,{
  //     foreignKey:'productId',
  //     onDelete:'CASCADE'
  // });
  // db.notification.belongsTo(db.product,{
  //     foreignKey:'productId'
  // });

db.sequelize.sync({force:false}).then(()=>{
    console.log('sync done');
})
module.exports = db;