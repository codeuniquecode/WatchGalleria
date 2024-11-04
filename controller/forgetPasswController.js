const { DATE } = require("sequelize");
const { user, vendor } = require("../model");
const sendEmail =require('../services/sendEmail')
exports.renderForget=(req,res)=>{
    return res.render('forgot.ejs');
    
}
exports.handleMail = async (req, res) => {
    const email = req.body.email;

    try {
        const userData = await user.findOne({ where: { email: email } });
        if(userData){
            const otp = Math.floor(1000 + Math.random() * 9000);
            await sendEmail({
                email:email,
                subject:"Reset Password WatchGalleria",
                otp:otp
            });
            await user.update({
                otp:otp,
            otpGeneratedTime:Date.now()
            },{where:{email:email}});
            
        return res.render('otpverify.ejs');
        }
        const vendorData = await vendor.findOne({ where: { email: email } });
        if(vendorData){
            const otp = Math.floor(1000 + Math.random() * 9000);
            await sendEmail({
                email:email,
                subject:"Reset Password WatchGalleria",
                otp:otp
            });
            await vendor.update({
                otp:otp,
            otpGeneratedTime:Date.now()
            },{where:{email:email}});
            
        return res.render('otpverify.ejs');
        }
        if(!userData && !vendorData){
            return res.send('No user found with this email');
        }
        return res.render('otpverify.ejs');
    } catch (error) {
        console.error('Error querying database:', error);
        return res.status(500).send('An error occurred');
    }
};

exports.otpVerify=(req,res)=>{
    const otp = req.body.otp;
    if(otp === '1234'){
        return res.render('resetpass.ejs');
    }
    return res.send('Invalid OTP');
}
