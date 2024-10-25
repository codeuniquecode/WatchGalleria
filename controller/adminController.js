const moment = require("moment");
const { user, order } = require("../model");
const { Op } = require("sequelize");
exports.renderAdminDashboard = async (req, res) => {
    return res.render('adminDashboard.ejs');
}
exports.logout= (req,res)=>{
    res.clearCookie('token');
    return res.redirect('/');
}
exports.renderOrderStatus = async (req,res)=>{
    const orderData = await order.findAll({
        include:[
            {
                model:user,
                attributes:['username']
            }

        ]
    });
    return res.render('orderStatus.ejs',{orderData,moment});
}
exports.orderSearch = async (req,res)=>{
    const {orderStatus} = req.body;
    const orderData = await order.findAll({
        where:{
            status:orderStatus
        },
        include:[
            {
                model:user,
                attributes:['username']
            }
        ]
    });
    if(orderData.length==0){
        return res.send('invalid keyword');
    }
    return res.render('orderStatus.ejs',{orderData,moment});
}
exports.renderUserMgmt = async (req,res)=>{
    const userData = await user.findAll();
    return res.render('userMgmt.ejs',{userData});
}
exports.userSearch = async (req,res)=>{
    const {username} = req.body;
    const userData = await user.findAll({
        where:{
            username:{
                 [Op.like]:'%'+username+'%'
            }
        }
    });
    if(userData.length==0){
        return res.send('invalid keyword');
    }
    return res.render('userMgmt.ejs',{userData});
}
exports.deleteUser = async (req,res)=>{
    const {id} = req.params;
    const admin = await user.findOne({
        where:{
            userId:id
        }
    });
    if(admin.role=='admin'){
        const userData = await user.findAll();
        return res.render('userMgmt.ejs',{message:'Admin Account cannot be deleted',userData});
    }
    await user.destroy({
        where:{
            userId:id
        }
    });
    return res.redirect('/admin/userMgmt');
}