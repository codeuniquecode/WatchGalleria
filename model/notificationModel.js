const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

const makeNotificationTable = (sequelize,DataTypes)=>{
    const Notification = sequelize.define('notification',{
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
        },
        message:{
            type:DataTypes.STRING,
            allowNull:false
        }
        
},{
    tableName:'notifications'
})
return Notification;
}
module.exports = makeNotificationTable