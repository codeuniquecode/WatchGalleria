const { DataTypes } = require("sequelize");
const sequelize = require(".");

const makeCartItemTable = (sequelize,DataTypes)=>{
    const CartItem = sequelize.define('cartItem',{
        cartItemId:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false
        },
        quantity:{
            type:DataTypes.INTEGER,
            allowNull:false
        }
    })
    return CartItem;
}
exports.makeCartItemTable = makeCartItemTable;