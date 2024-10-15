const { DataTypes } = require("sequelize");
const sequelize = require(".");

const makeCartTable = (sequelize, DataTypes)=>{
    const Cart = sequelize.define('cart',{
        cartId:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false
        }
})
return Cart;
}
module.exports = makeCartTable;