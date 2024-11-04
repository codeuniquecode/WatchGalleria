const nodemailer = require('nodemailer');
//site ko 
const sendEmail  = async (options)=>{
    var transporter = nodemailer.createTransport({
        service:"gmail",// kun use garera pathauni can be yahoo or others too
        // if service dont work use this 
        // host:"smtp.gmail.com",
        // port:465,
        auth:{
            user:process.env.EMAILUSER,
            pass:process.env.EMAILKEY,//gmail ko password haina yo,app password ho 
        }
    });
    const mailOptions = {
        from :"WatchGalleria",
        to:options.email,
        subject:  options.subject,
        text:"Your OTP is " +options.otp
    };
    await transporter.sendMail(mailOptions);
}
module.exports = sendEmail;