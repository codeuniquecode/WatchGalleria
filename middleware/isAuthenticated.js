const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { user } = require('../model');

exports.isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        // Check if token is provided
        if (!token) {
            const message1 = 'Please Login!!!';
            return res.render('login',{message1});
            
        }

        // Verify the token
        const decryptedResult = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

        // Check if the user exists in the database
        const userExist = await user.findAll({
            where: {
                userId: decryptedResult.id
            }
        });
        if(!userExist){
            const vendorExist = await vendor.findAll({
                where:{
                    vendorId: decryptedResult.id
                }

            })
        }
        
        // Handle case where user does not exist
          // If neither user nor vendor exists
        if (!vendorExist) {
            return res.status(404).send('User or Vendor does not exist');
        }
        
        // Store the user ID in the request for future use
        req.user = decryptedResult.id;
        
        next();

    } catch (err) {
        // Handle invalid or expired tokens
        console.error('Authentication error:', err);
        return res.status(401).render('login', { message: 'Session expired or invalid token. Please login again.' });
    }
};
