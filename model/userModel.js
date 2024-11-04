const { DataTypes } = require("sequelize");
const sequelize = require(".");
const { name } = require("ejs");
const { password } = require("../config/dbConfig");

const makeUserTable = (sequelize, DataTypes)=>{
    const User = sequelize.define('user',{
        userId :{
            type : DataTypes.INTEGER,
            primaryKey :true,
            autoIncrement: true,
            allowNull:false
        },
        username: {
            type: DataTypes.STRING,
            allowNull:false
        },
        phonenumber:{
            type: DataTypes.STRING,
            allowNull:false
        },
        email: {
            type: DataTypes.STRING,
            allowNull:false
        },
        password:{
            type :DataTypes.STRING,
            allowNull:false
        },
        address:{
            type:DataTypes.STRING,
            allowNull:false
        },
        profilepic:{
            type:DataTypes.STRING,
            allowNull:false
        },
        role:{
            type: DataTypes.STRING,
            allowNull:false,
            defaultValue : 'user'
        },
        otp:{
            type:DataTypes.STRING,
            allowNull:true
        },
        otpGeneratedTime:{
            type:DataTypes.STRING,
            allowNull:true
        }
    })
    return User;
}
module.exports = makeUserTable;


// full name
// phone Number
// email
// password
// address
// photo


// login
// email and pass