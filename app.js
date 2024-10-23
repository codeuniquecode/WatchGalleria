const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const {user,vendor, sequelize, cart, cartItem} = require('./model/index');
require('dotenv').config();
const multer = require('./middleware/multerConfig').multer;
const bcrypt = require('bcrypt');
const storage = require('./middleware/multerConfig').storage;
const upload = multer({storage: storage});
// const dbConfig = require('./config/dbConfig');
// const {user} = dbConfig;

const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const cookieParser = require('cookie-parser');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.static('storage'));

app.use(express.urlencoded({extended:true})); 
app.use(cookieParser());
// app.use(express.json());
require("./model/index");

// Middleware to decrypt token and set current user information in locals
app.use(async (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            // Decrypt the token
            const decryptedResult = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
            // Store the decrypted token content in res.locals
            res.locals.currentUser = decryptedResult; // Store full token data
            res.locals.userName = decryptedResult.name; // Specifically store the userName
            const userId = decryptedResult.id;
            // Fetch the user from the database
            const userRecord = await user.findOne({ where: { userId } });
            if (!userRecord) {
                res.locals.cartCount = 0;
            }
            else {
                // Fetch the cart items for the user
                const userCart = await cart.findOne({ where: { userId } });
                
                if (userCart) {
                    // Fetch the count of items in the cart
                    const itemCount = await cartItem.count({ where: { cartId: userCart.cartId } });
                    res.locals.cartCount = itemCount; // Set cart count based on the number of items
                } else {
                    res.locals.cartCount = 0; // No cart found
                }
            }

        } catch (err) {
            res.locals.currentUser = null;  // Set to null in case of error
            res.locals.userName = null;
            res.locals.cartCount = 0;
            console.error('Error verifying token:', err);
        }
    } else {
        res.locals.currentUser = null;
        res.locals.userName = null;
        res.locals.cartCount = 0;
    }

    next();
});

// app.use((req, res, next) => {
//     res.locals.currentUser = req.cookies.token;
    
//     next();
// });

// routing
const userRoutes = require('./routes/userRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const loginRoutes = require('./routes/loginRoutes');
const adminRoutes= require('./routes/adminRoutes');
// Use userRoutes on the root path
app.use('/', userRoutes);

// Use vendorRoutes on a different path
app.use('/vendor', vendorRoutes);
app.use('/', loginRoutes);
app.use('/admin',adminRoutes);
app.listen(port,()=>{
    console.log(`the server is running on port ${port}`);
})