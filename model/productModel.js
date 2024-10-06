const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

const makeProductTable = (sequelize,DataTypes)=>{
    const Product = sequelize.define('product',{
        productId:{
            type : DataTypes.INTEGER,
            primaryKey :true,
            autoIncrement: true,
            allowNull:false
        },
        productname:{
            type: DataTypes.STRING,
            allowNull:false
        },
        description:{
            type: DataTypes.TEXT,
            allowNull:false
        },
        price:{
            type:DataTypes.STRING,
            allowNull:false
        },
        quantity:{
            type:DataTypes.STRING,
            allowNull:false
        },
        productpicture:{
            type:DataTypes.STRING,
            allowNull:false
        }
    })
    return Product;
}
module.exports = makeProductTable;