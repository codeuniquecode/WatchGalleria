const { DataTypes } = require("sequelize");
const sequelize = require(".");
const makeVendorTable = (sequelize, DataTypes)=>{
    const Vendor = sequelize.define('vendor',{
        vendorId : {
            type: DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true,
            allowNull:false
        },
        shopname : {
            type: DataTypes.STRING,
            allowNull:false,
        },
        role:{
            type: DataTypes.STRING,
            allowNull:false,
            defaultValue : 'vendor'
        },
        email: {
            type: DataTypes.STRING,
            allowNull:false
        },
        password:{
            type :DataTypes.STRING,
            allowNull:false
        },
        phonenumber:{
            type :DataTypes.STRING,
            allowNull:false
        },
        address:{
            type :DataTypes.STRING,
            allowNull:false
        },
        status:{
            type: DataTypes.STRING,
            allowNull:false,
            defaultValue:'pending'
        },
        photo:{
            type :DataTypes.STRING,
            allowNull:false
        }
    })
    return Vendor;
}
module.exports = makeVendorTable;