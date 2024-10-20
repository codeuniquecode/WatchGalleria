const { DataTypes } = require("sequelize");
const sequelize = require(".");


const makeOrderTable = (sequelize,DataTypes)=>{
    const Order = sequelize.define('order',{
        orderId:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false
        },
        orderDate:{
            type:DataTypes.DATE,
            allowNull:false
        },
        status:{
            type:DataTypes.STRING,
            allowNull:false,
            defaultValue:'Pending'
        },
        Totalamount:{
            type:DataTypes.INTEGER,
            allowNull:false
        }
    })
    return Order;
}
module.exports = makeOrderTable;