const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { user, vendor, notification } = require('../model'); // Assuming you're also importing vendor

exports.isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        // Check if token is provided
        if (!token) {
            const message1 = 'Please Login!!!';
            return res.render('login', { message1 });
        }

        // Verify the token
        const decryptedResult = await promisify(jwt.verify)(token, process.env.SECRET_KEY);

        // Check if the user exists in the database
        const userExist = await user.findOne({
            where: {
                userId: decryptedResult.id
            }
        });

        // If user does not exist, check if vendor exists
        let vendorExist = null;
        if (!userExist) {
            vendorExist = await vendor.findOne({
                where: {
                    vendorId: decryptedResult.id
                }
                
            });
        }
        if(vendorExist){
            notifyCount = await notification.count({
                where: {
                    vendorId: decryptedResult.id,
                    read_status: false
                }
            });
            res.locals.unreadNotificationsCount = notifyCount;
        }

        // Handle case where neither user nor vendor exists
        if (!userExist && !vendorExist) {
            return res.status(404).send('User or Vendor does not exist');
        }

        // Store the user ID (or vendor ID) in the request for future use
        req.user = decryptedResult.id; // If user exists, this will be the user ID
       
        next();

    } catch (err) {
        // Handle invalid or expired tokens
        console.error('Authentication error:', err);
        return res.status(401).render('login', { message: 'Session expired or invalid token. Please login again.' });
    }
};
