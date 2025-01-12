const { DATE } = require("sequelize");
const { user, vendor } = require("../model");
const sendEmail =require('../services/sendEmail')
const bcrypt = require('bcrypt');
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
            
        return res.render('otpverify.ejs',{email:userData.email,userType:'user'});
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
            
        return res.render('otpverify.ejs',{email:vendorData.email,userType:'vendor'});
        }
        if(!userData && !vendorData){
            
    return res.render('showMessage.ejs', { message: 'No user found with this email.' });
        }
        return res.render('otpverify.ejs');
    } catch (error) {
        console.error('Error querying database:', error);
        return res.status(500).send('An error occurred');
    }
};

exports.otpVerify= async (req,res)=>{
    const otp = req.body.otp;
    const email = req.body.email;
    const userType = req.body.userType;
    if(!otp || !email){
        return res.send('Please provide email and otp');
    }
    if(userType==='user'){
       const validUser = await user.findOne({
        where:{
            email,
            otp
        }
       });
       if(validUser){
              const otpGeneratedTime = validUser.otpGeneratedTime;
              const currentTime = Date.now();
              const difference = currentTime - otpGeneratedTime;
              if(difference>120000){
                return res.send('OTP has been expired');
              }
              return res.render('resetpass.ejs',{email,userType});
       }
    }
    if(userType==='vendor'){
        const validVendor = await vendor.findOne({
         where:{
             email,
             otp
         }
        });
        if(validVendor){
               const otpGeneratedTime = validVendor.otpGeneratedTime;
               const currentTime = Date.now();
               const difference = currentTime - otpGeneratedTime;
               if(difference>120000){
                 
    return res.render('showMessage.ejs', { message: 'OTP has been expired.' });
               }
               return res.render('resetpass.ejs',{email,userType});
        }
     }
    
     return res.render('showMessage.ejs', { message: 'Invalid OTP, please try again.' });
}
exports.resetPassword = async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const userType = req.body.userType;
    if(!email || !password){
        return res.send('Please provide email and password');
    }
    const hashedPassword = await bcrypt.hash(password,1);
    if(userType==='user'){
        await user.update({
            password:hashedPassword
        },{where:{email}});
        return res.redirect('/login');
    }
    if(userType==='vendor'){
        await vendor.update({
            password:hashedPassword
        },{where:{email}});
        return res.redirect('/login');
    }
    return res.send('Invalid user type');
}