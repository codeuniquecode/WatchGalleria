const moment = require("moment");
const { user, order } = require("../model");

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