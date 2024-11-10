const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { user } = require('../model');

exports.isAdmin = async (req, res, next) => {
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

        // Handle case where user does not exist
        if (!userExist) {
            return res.status(404).send('User does not exist');
        }
        // Check if user is an admin
        if (userExist.role !== 'admin') {
            return res.render('showMessage.ejs', { message: 'You are not authorized to view this page!!!' });
        }

        // Store the user ID in the request for future use
        req.admin = decryptedResult.id;

        next();

    } catch (err) {
        // Handle invalid or expired tokens
        console.error('Authentication error:', err);
        return res.status(401).render('login', { message: 'Session expired or invalid token. Please login again.' });
    }
}