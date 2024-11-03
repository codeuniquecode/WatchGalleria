const { user, vendor } = require("../model");

exports.renderForget=(req,res)=>{
    return res.render('forgot.ejs');
    
}
exports.handleMail=(req,res)=>{
    const email = req.body.email;
    const userData = user.findOne({where:{email:email}});
    if(!userData){
        const vendorData = vendor.findOne({where:{email:email}});
    }
    if(!userData && !vendorData){
        return res.send('No user found with this email');
    }
    return res.render('otpverify.ejs');
}
exports.otpVerify=(req,res)=>{
    const otp = req.body.otp;
    if(otp === '1234'){
        return res.render('resetpass.ejs');
    }
    return res.send('Invalid OTP');
}
