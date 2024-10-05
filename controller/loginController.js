const {user,vendor, sequelize} = require('../model/index');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
exports.login=(req,res)=>{
    res.render('login');
}

exports.loginValidation = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.send('Please enter credentials to continue');
    }

    try {
        // First, check the user table
        const validUser = await user.findOne({
            where: { email: email }
        });

        if (validUser) {
            // Use bcrypt.compare to compare the input password with the hashed password stored in the DB
            const passwordCheck = await bcrypt.compare(password, validUser.password); 
            if (passwordCheck) {
                if (validUser.role === 'admin') {
                    const payload = {
                        id: validUser.userId,
                        name: validUser.username
                    };
                    const token = jwt.sign(payload,process.env.SECRET_KEY,{
                        expiresIn: "30d"
                    });
                    res.cookie('token',token);
                    return res.redirect('/admin');
                } else {
                    const payload = {
                        id: validUser.userId,
                        name: validUser.username
                    };
                    const token = jwt.sign(payload,process.env.SECRET_KEY,{
                        expiresIn: "30d"
                    });
                    res.cookie('token',token);
                    return res.redirect('/');
                }
            } else {
                return res.send('Invalid password, try again');
            }
        }

        // If user not found, check the vendor table
        const validVendor = await vendor.findOne({
            where: { email: email }
        });

        if (validVendor) {
            const passwordCheck = await bcrypt.compare(password, validVendor.password); 
            if (passwordCheck) {
                const payload = {
                    id: validVendor.vendorId,
                    name: validVendor.shopname
                };
                const token = jwt.sign(payload,process.env.SECRET_KEY,{
                    expiresIn: "30d"
                });
                res.cookie('token',token);
             return res.redirect('/vendor/vendordashboard');
            } else {
                return res.send('Invalid password');
            }
        }

        // If neither user nor vendor is found
        return res.send('Email not found, please register.');

    } catch (e) {
        console.error('Error in finding email:', e);
        return res.status(500).send('An error occurred. Please try again.');
    }
}