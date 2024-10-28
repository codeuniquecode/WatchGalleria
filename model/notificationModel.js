const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

const makeNotificationTable = (sequelize,DataTypes)=>{
    const Notification = sequelize.define('Notification',{
        NotificationId:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false
        },
        type:{
            type:DataTypes.STRING,
            allowNull:false
        },
        read_status:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        }
})
return Notification;
}
module.exports = makeNotificationTable