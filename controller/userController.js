
const {user, sequelize, category, product, cart, cartItem, order, orderItem, vendor} = require('../model/index');
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
        const userExist = await user.findOne({
            where: {
                email
            }
        })
        if (userExist) {
            return res.render('showMessage.ejs', { message: 'User with this email already exists.' });
        }
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
        return res.render('showMessage.ejs', { message: 'Access Denied ! You are not authorized to view this page' });
    }
}
exports.logout= (req,res)=>{
    res.clearCookie('token');
    res.locals.role = null;
    res.redirect('/');
}
exports.editProfile= async(req,res)=>{
    const userId = req.user;
    if(res.locals.role === 'vendor'){
        return res.render('showMessage.ejs', { message: 'Vendors are requested to edit their profile via vendor dashboard only' });
    }
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
    if(res.locals.role === 'vendor'){
        return res.render('showMessage.ejs', { message: 'Vendors are requested to change their password via vendor dashboard' });
    }
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
        return res.render('showMessage.ejs', { message: 'Old Password doesnot match, Please try again!!!' });
    }
}
//see products
exports.renderMen = async (req, res) => {
    try {
        const data = await product.findAll({
            where: {
                quantity: {
                    [Op.gt]: 0
                }
            },
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
            where: {
                quantity: {
                    [Op.gt]: 0
                }
            },
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
            where: {
                quantity: {
                    [Op.gt]: 0
                }
            },
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
            where: {
                quantity: {
                    [Op.gt]: 0
                }
            },
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
        return res.render('showMessage.ejs', { message: 'Please Login to add item to cart' });
    }
    if(res.locals.role === 'vendor'){
        return res.render('showMessage.ejs', { message: 'You are not authorized to add items to cart' });
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
        return res.render('showMessage.ejs', { message: 'Please Login to view your cart' });
    }

    try {
        const userCart = await cart.findOne({ where: { userId } });
        if (!userCart) {
            return res.render('showMessage.ejs', { message: 'No items in your cart!!!' });
        }

        const cartItems = await cartItem.findAll({
            where: {
                cartId: userCart.cartId
            },
            include: product
        });

        if (!cartItems || cartItems.length === 0) {
            return res.render('showMessage.ejs', { message: 'No items in your cart!!!' });
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
const { Sequelize, Op } = require('sequelize'); // Ensure you import Sequelize

exports.renderOrder = async (req, res) => {
    const userId = req.user; // Assuming `req.user` contains the logged-in user ID
    if(res.locals.role === 'vendor'){
        return res.render('showMessage.ejs', { message: 'See order page from vendor dashboard' });
    }
    if (!userId) {
        return res.render('showMessage.ejs', { message: 'Please Login to view orders' });
    }

    try {
        // Find all orders for the user
        const userOrders = await order.findAll({
            where: { userId },
            include: [{
                model: orderItem,
                include: [{
                    model: product,
                    required: false // Ensures that orders are fetched even if no product is linked
                }]
            }]
        });
        

        // Calculate the total amount for each order (similar to what you did previously)
        // userOrders.forEach(order => {
        //     let totalAmount = 0;
        //     order.orderItems.forEach(item => {
        //         totalAmount += item.quantity * item.price;
        //     });
        //     order.Totalamount = totalAmount; // Temporarily set this for rendering
        // });

        // Check if orders exist
        if (!userOrders || userOrders.length === 0) {
            return res.render('showMessage.ejs', { message: 'No order found' });
        }

        // Aggregate the sum of all total amounts for this user's orders
        const sumTotalAmount = await order.sum('Totalamount', {
            where: { userId }
        });

        // Render the order page and pass the total sum and the individual user orders
        res.render('userOrder.ejs', { userOrders, sumTotalAmount });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching user orders');
    }
};
exports.searchProduct = async (req,res)=>{
    
    const {search} = req.body;
    const data = await product.findAll({
        where:{
            productname:{
               [Op.like]:'%'+search+'%'
            }
        }
    });
    if(!data || data.length === 0){
      return res.render('showMessage.ejs', { message: 'We couldnot find any matches. Try adjusting your search.' });
    }
    res.render('product.ejs',{data});
}

exports.placeOrder = async (req, res) => {
    const userId = req.user;
    const productIds = req.body.productIds;
    const quantities = req.body.quantities;
    const prices = req.body.prices;

    if (!userId) {
        return res.render('showMessage.ejs', { message: 'Please Login to place order' });
    }
    const userData = await user.findOne({
        where:{
            userId
        }
    })

    try {
        const userCart = await cart.findOne({ where: { userId } });
        if (!userCart) {
            return res.send('No items in your cart');
        }

        const cartItems = await cartItem.findAll({
            where: { cartId: userCart.cartId },
            include: product,
        });

        if (!cartItems || cartItems.length === 0) {
            return res.send('No items in your cart');
        }

        let totalAmount = 0;
        cartItems.forEach((item, index) => {
            const productPrice = prices[index];
            const requestedQuantity = quantities[index];
            totalAmount += requestedQuantity * productPrice;
        });

        // Create a temporary order data object
        const orderData = {
            orderDate: new Date(),
            totalAmount,
            userId,
            items: cartItems.map((item, index) => ({
                productId: productIds[index],
                quantity: quantities[index],
                price: prices[index],
            })),
        };

        // Render `order.ejs` with the temporary order details
        return res.render('order.ejs', { orderData, cartItems, totalAmount,userData });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error preparing the order');
    }
};
// exports.paymentSuccess = async (req, res) => {
    
//     return res.render('showMessage.ejs', { message: 'Payment was successful, your product will be delivered soon.' });
    
// };

exports.paymentSuccess = async (req, res) => {
    const userId = req.user;
    console.log(userId);

    if (!userId) {
        return res.render('showMessage.ejs', { message: 'Please Login to place an order' });
    }

    const transaction = await sequelize.transaction();

    try {
        // Step 1: Fetch user cart and items
        const userCart = await cart.findOne({ where: { userId }, transaction });
        if (!userCart) {
            await transaction.rollback();
            return res.render('showMessage.ejs', { message: 'No items in your cart' });
        }

        const cartItems = await cartItem.findAll({
            where: { cartId: userCart.cartId },
            include: product,
            transaction
        });

        if (!cartItems || cartItems.length === 0) {
            await transaction.rollback();
            return res.render('showMessage.ejs', { message: 'No items in your cart' });
        }

        // Step 2: Calculate total amount and check inventory
        let totalAmount = 0;
        for (const item of cartItems) {
            if (item.quantity > item.product.quantity) {
                await transaction.rollback();
                return res.render('showMessage.ejs', { message: `Quantity not available for ${item.product.productname}.` });
            }
            totalAmount += item.quantity * item.product.price;
        }

        // Step 3: Create the order
        const newOrder = await order.create({
            orderDate: new Date(),
            Totalamount: totalAmount,
            userId,
        }, { transaction });

        // Step 5: Handle background tasks
        // Create order items and update inventory in parallel
        const orderItemsPromises = cartItems.map((item) =>
            orderItem.create({
                orderId: newOrder.orderId,
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
            }, { transaction })
        );

        const updateInventoryPromises = cartItems.map((item) =>
            product.update(
                { quantity: item.product.quantity - item.quantity },
                { where: { productId: item.productId }, transaction }
            )
        );

        await Promise.all([...orderItemsPromises, ...updateInventoryPromises]);

        // Clear the cart
        await cartItem.destroy({ where: { cartId: userCart.cartId }, transaction });
        await cart.destroy({ where: { userId }, transaction });

        await transaction.commit();

        console.log('Order processing completed in the background.');
        // Step 4: Render the response immediately
        return res.render('showMessage.ejs', { message: 'Payment was successful, your product will be delivered soon.' });

    } catch (error) {
        await transaction.rollback();
        console.error('Error processing the order:', error);
        return res.status(500).send('Error processing the order');
    }
};



exports.paymentfailure = async (req,res)=>{
    const userId = req.user;

    return res.render('showMessage.ejs', { message: 'Payment was unsuccessful, please try again.' });
}
// exports.updateinfo = async (req,res)=>{
//     const {name,address,phonenumber}= req.body;
//     const userId = req.user;
//     if(userId){
//         const update = await user.update({
//             username:name,
//             address:address,
//             phonenumber:phonenumber
//         },{
//             where:{
//                 userId
//             }
//         });
//         if(update){
//             return res.redirect('/placeOrder');
//         }
//     }
//     else{
//         return res.send('user doesnt exists');
//     }
// }