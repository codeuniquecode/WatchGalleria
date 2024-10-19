const { DataTypes } = require("sequelize");
const sequelize = require(".");

const makeOrderItemTable = (sequelize, DataTypes)=>{
    const OrderItem = sequelize.define('orderItem',{
        orderItemId:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false
        },
        quantity:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        price:{
            type:DataTypes.INTEGER,
            allowNull:false
        }
})
return OrderItem;
}
module.exports = makeOrderItemTable;