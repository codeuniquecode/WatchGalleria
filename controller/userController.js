
const {user, sequelize, category, product, cart, cartItem} = require('../model/index');
const multer = require('../middleware/multerConfig').multer;
const jwt = require('jsonwebtoken');
const storage = require('../middleware/multerConfig').storage;
const upload = multer({storage: storage});
const bcrypt = require('bcrypt');
const fs = require('fs');
const { profileEnd } = require('console');
//routing codes -- GET
exports.home = (req,res)=>{
    res.render('index.ejs');
}
exports.cs =(req,res)=>{
    res.render('cs');
}

exports.signup =(req,res)=>{
    res.render('signup');
}
exports.forget = (req,res)=>{
    res.render('forgot');
}


//POST
exports.register = [
    upload.single('image'), // Define as an array
    async (req, res) => {
        const { fullname, phonenumber, email, password, address } = req.body;
        await user.create({
            username: fullname,
            phonenumber: phonenumber,
            email: email,
            password: bcrypt.hashSync(password, 1),
            address: address,
            profilepic: req.file.filename
        });
        res.redirect('/login');
    }
];

//admin
exports.adminDashboard = async (req,res)=>{
    const userId = req.user;
    const userData = await user.findOne({
        where:{
            userId
        }
    })
    if(userData.role !== 'admin'){
        return res.send('Access Denied ! You are not authorized to view this page');
    }

    res.send('admin dashboard here');
}
exports.logout= (req,res)=>{
    res.clearCookie('token');
    res.redirect('/');
}
exports.editProfile= async(req,res)=>{
    const userId = req.user;
    const userData = await user.findOne({
        where:{
            userId
        }
    })
    res.render('userEditProfile',{userData});
}
exports.updateProfile =async(req,res)=>{
    const userId = req.user;//from isAuthenticated middleware
    const {name,phone,email,address} = req.body;
    // console.log('Request body:', req.body);
    // console.log('Uploaded file:', req.file);
    // return;
    //yedi naya foto halyo vane update garne natra purano nai halne
    const oldData = await user.findAll({
        where:{
            userId
        }
    })
    var fileUrl;
    if(req.file){
        fileUrl = req.file.filename
        const oldImage =  oldData[0].profilepic;
        //purano file delete garne
        fs.unlink('storage/'+oldImage ,(err)=>{
            if(err){
                console.log('error happened');
            }
            else{
                console.log('deleted successfully');
            }
        })
    }
    else{
        fileUrl = oldData[0].profilepic
    }
    if(userId){
         const update = await user.update({
            username:name,
            phonenumber:phone,
            email:email,
            address:address,
            profilepic:fileUrl
        },{
            where:{
                userId
            }
        });
        if (update) {
            // Fetch the updated user data from the database
            const updatedUser = await user.findOne({ where: { userId } });
    
            // Create a new token with updated information
            const token = jwt.sign({
                id: updatedUser.userId,
                name: updatedUser.name,  // Updated name
                email: updatedUser.email
            }, process.env.SECRET_KEY, { expiresIn: '30d' });
    
            // Set the new token in the response cookies
            res.cookie('token', token, { httpOnly: true });
    
            // Respond to the client
            return res.redirect('/login');
        }
    }
    else{
        return res.send('user doesnt exists');
    }
  
}
exports.renderChangePassword = (req,res)=>{
    res.render('changepass.ejs');
}
exports.changePassword = async(req,res)=>{
    const userId = req.user;
    const {old_password,new_password} = req.body;
    if(new_password.length<8){
        return res.send('password must be atleast 8 characters long');
    }
    const userData = await user.findOne({
        where:{
            userId
        }
    })
    const isMatch = bcrypt.compareSync(old_password,userData.password);
    if(isMatch){
        const update = await user.update({
            password:bcrypt.hashSync(new_password,1)
        },{
            where:{
                userId
            }
        });
        if(update){
            return res.redirect('/login');
        }
    }
    else{
        return res.send('old password doesnot match,please try again');
    }
}
//see products
exports.renderMen = async (req, res) => {
    try {
        const data = await product.findAll({
            include: {
                model: category,
                where: {
                    categoryName: 'Mens' // Filter using the category model
                }
            }
        });

        if (!data || data.length === 0) {
            return res.send('No products found');
        }

        res.render('product.ejs', { data });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
exports.renderWomen = async (req, res) => {
    try {
        const data = await product.findAll({
            include: {
                model: category,
                where: {
                    categoryName: 'Womens' // Filter using the category model
                }
            }
        });

        if (!data || data.length === 0) {
            return res.send('No products found');
        }

        res.render('product.ejs', { data });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
exports.renderSmart = async (req, res) => {
    try {
        const data = await product.findAll({
            include: {
                model: category,
                where: {
                    categoryName: 'Sports' // Filter using the category model
                }
            }
        });

        if (!data || data.length === 0) {
            return res.send('No products found');
        }

        res.render('product.ejs', { data });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
exports.renderLuxury = async (req, res) => {
    try {
        const data = await product.findAll({
            include: {
                model: category,
                where: {
                    categoryName: 'Luxury' // Filter using the category model
                }
            }
        });

        if (!data || data.length === 0) {
            return res.send('No products found');
        }

        res.render('product.ejs', { data });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
exports.seeProduct = async (req, res) => {
    const productId = req.params.id;
    const data = await product.findOne({
        where: {
            productId
        }
    });
    if(!data){
        return res.send('Product not found');
    }
    res.render('seeProduct.ejs', { data });
}
exports.addToCart = async (req, res) => {
    const userId = req.user; // Assuming `req.user` contains the logged-in user ID
    const productId = req.params.id; // Fetching product ID from URL parameters
    const quantity = 1; // Default quantity to add to the cart

    if (!userId) {
        return res.send('Please login to add items to your cart');
    }

    try {
        // Check if the product exists first (Optional but recommended)
        const foundproduct = await product.findOne({
            where: { productId }
        });

        if (!foundproduct) {
            return res.status(404).send('Product not found');
        }

        // Find or create the cart for the user
        let userCart = await cart.findOne({ where: { userId } });

        if (!userCart) {
            // If the user doesn't have a cart, create one
            userCart = await cart.create({ userId });
        }

        // Ensure userCart.cartId is properly populated
        const cartId = userCart.cartId;  // Here, we use cartId as the PK

        if (!cartId) {
            throw new Error('Cart creation failed');
        }

        // Check if the product is already in the cart
        const existingCartItem = await cartItem.findOne({
            where: {
                cartId,
                productId
            }
        });

        if (existingCartItem) {
            // If the product is already in the cart, increment the quantity
            await existingCartItem.update({
                quantity: existingCartItem.quantity + 1
            });
        } else {
            // If the product is not in the cart, add it with a default quantity of 1
            await cartItem.create({
                cartId,
                productId,
                quantity
            });
        }

        // Redirect to the cart page after adding the item
        res.redirect('/cart');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding item to the cart');
    }
};

exports.renderCart = async (req, res) => {
    const userId = req.user; // Assuming `req.user` contains the logged-in user ID

    if (!userId) {
        return res.send('Please login to view your cart');
    }

    try {
        const userCart = await cart.findOne({ where: { userId } });
        if (!userCart) {
            return res.send('No items in your cart');
        }

        const cartItems = await cartItem.findAll({
            where: {
                cartId: userCart.cartId
            },
            include: product
        });

        if (!cartItems || cartItems.length === 0) {
            return res.send('No items in your cart');
        }

        res.render('cart.ejs', { cartItems });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching cart items');
    }
}
exports.removeProduct = async (req, res) => {
    const userId = req.user; // Assuming `req.user` contains the logged-in user ID
    const productId = req.params.id; // Fetching product ID from URL parameters

    if (!userId) {
        return res.send('Please login to remove items from your cart');
    }

    try {
        const userCart = await cart.findOne({ where: { userId } });
        if (!userCart) {
            return res.send('No items in your cart');
        }

        const foundcartItem = await cartItem.findOne({
            where: {
                cartId: userCart.cartId,
                productId
            }
        });

        if (!foundcartItem) {
            return res.send('Item not found in your cart');
        }

        await cartItem.destroy({
            where: {
                cartId: userCart.cartId,
                productId
            }
        });

        res.redirect('/cart');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error removing item from the cart');
    }
}
exports.placeOrder = async (req, res) => {
    const userId = req.user; // Assuming `req.user` contains the logged-in user ID
    
        const productIds = req.body.productIds;  // Array of product IDs
        const quantities = req.body.quantities;  // Array of quantities
        const prices = req.body.prices;          // Array of prices
        const totals = req.body.totals;          // Array of totals
        res.send(`the user id is ${userId}, productIds are ${productIds}, quantities are ${quantities}, prices are ${prices}, totals are ${totals}`);
    return;
    if (!userId) {
        return res.send('Please login to place an order');
    }

    try {
        const userCart = await cart.findOne({ where: { userId } });
        if (!userCart) {
            return res.send('No items in your cart');
        }

        const cartItems = await cartItem.findAll({
            where: {
                cartId: userCart.cartId
            },
            include: product
        });

        if (!cartItems || cartItems.length === 0) {
            return res.send('No items in your cart');
        }
        //aba chai order ko code halne
        // create order table and orderItem table if they dont exists, then insert the data and remove datas from cartItem and cart table 
        // finally redirect to order page

        res.render('order.ejs', { cartItems });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching cart items');
    }
}