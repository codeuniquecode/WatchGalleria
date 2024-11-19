
const {user,vendor, sequelize, product, order, Sequelize, orderItem, notification} = require('../model/index');
const multer = require('../middleware/multerConfig').multer;
const storage = require('../middleware/multerConfig').storage;
const upload = multer({ storage: storage });
const bcrypt = require('bcrypt');
const fs = require('fs');
const { Op } = require('sequelize');
exports.login = (req, res) => {
    res.render('login');
}

exports.forget = (req, res) => {
    res.render('forgot');
}

// Renamed for clarity
exports.showVendorRegister = (req, res) => {
    res.render('vendorsignup');
}

// POST vendor register
exports.vendorRegister = [
    upload.single('photo'),
    async (req, res) => {
        try {
            const { shopname, phonenumber, email, password, address } = req.body;
            const vendorExist = await vendor.findOne({
                where: {
                    email
                }
            })
            if (vendorExist) {
                return res.render('showMessage.ejs', { message: 'Vendor with this email already exists' });
            }
            await vendor.create({
                shopname: shopname,
                email: email,
                password: bcrypt.hashSync(password, 1),
                phonenumber: phonenumber,
                address: address,
                photo: req.file.filename
            });
            res.redirect('/login');
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }
];
exports.vendorDashboard = async (req,res)=>{
    const vendorId = req.user;
    const vendorData = await vendor.findOne({
        where:{
            vendorId
        },
        include:{
            model:product
        }
    })
    const productCount = await product.count({
        where: {
            vendorId
        }
    });
        // Step 1: Find number of orders for this vendor by checking order items
        const orderCount = await orderItem.count({
            include: {
                model: product,
                where: {
                    vendorId
                }
            }
        });

       // Step 2: Calculate total sales by summing the price * quantity for all order items related to this vendor
       const totalSaleResult = await orderItem.findOne({
        include: {
            model: product,
            where: {
                vendorId
            }
        },
        attributes: [[Sequelize.fn('SUM', Sequelize.literal('product.price * product.quantity')), 'totalSales']],
        raw: true  // This ensures the result is a plain object
    });

    // Extract total sales from the result
    const totalSales = totalSaleResult ? totalSaleResult.totalSales : 0;
    if(!vendorData){
        return res.send('Vendor does not exist');
    }
    if(vendorData.role !== 'vendor'){
        return res.send('Access Denied ! Login as a vendor to view this page');
    }
    const notificationCount = await notification.count({
        where: {
            read_status: false
        }});

    res.render('vendorDashboard',{vendorData,productCount,orderCount,totalSales,notificationCount});
}
exports.renderAddProduct = (req,res)=>{
    res.render('addProduct');
}
exports.addProduct =[
    upload.single('product_photo'),
    async (req,res)=>{
        const vendorId = req.user;
        const {productname,price,description,quantity,categories} = req.body;
        const add= await product.create({
            vendorId,
            productname,
            price,
            description,
            productpicture:req.file.filename,
            quantity,
            categoryId :categories
        });
        if(!add){
            return res.send('Product not added');
        }
        res.render('addProduct',{message:'Product added successfully'});
    }
]
exports.renderEditProfile = (req,res)=>{
    res.render('editVendorProfile');
}
exports.editProfile = async(req,res)=>{
    const vendorId = req.user;
    if(!vendorId){
        return res.send('Vendor does not exist');
    }   
    const {phone,email,address} = req.body;
    const update = await vendor.update({
        phonenumber:phone,
        email,
        address
    },{
        where:{
            vendorId
        }
    });
    if(!update){
        return res.send('Profile not updated');
    }
    res.render('editVendorProfile',{message:'Profile updated successfully'});
}
exports.logout = (req,res)=>{
    res.clearCookie('token');
    res.locals.role = null;
    res.redirect('/login');
}
exports.renderChangePassword = (req,res)=>{
    res.render('vendorChangepass.ejs');
}
exports.changePassword = async(req,res)=>{
    const vendorId = req.user;
    const {old_password,new_password} = req.body;
    if(new_password.length<8){
        return res.send('password must be atleast 8 characters long');
    }
    const vendorData = await vendor.findOne({
        where:{
            vendorId
        }
    })
    const isMatch = bcrypt.compareSync(old_password,vendorData.password);
    if(isMatch){
        const update = await vendor.update({
            password:bcrypt.hashSync(new_password,1)
        },{
            where:{
                vendorId
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
exports.viewProduct = async(req,res)=>{
    const vendorId = req.user;
    const vendorData = await vendor.findOne({
        where:{
            vendorId
        },
        include:{
            model:product
        }
    })
    if(!vendorData){
        return res.send('Vendor does not exist');
    }
    if(vendorData.role !== 'vendor'){
        return res.send('Access Denied ! Login as a vendor to view this page');
    }
    const productData = await product.findAll({
        where:{
            vendorId
        }
    });
    if(!productData){
        return res.send('No products found');
    }
    res.render('viewProduct',{products: vendorData.products});
}
exports.editProduct= async(req,res)=>{
    const productId = req.params.id;
    const productData = await product.findOne({
        where:{
            productId
        }
    });
    if(!productData){
        return res.send('Product does not exist');
    }
    res.render('editProduct',{productData});
}
exports.updateProduct = [
    upload.single('product_photo'),
    async(req,res)=>{
        const productId = req.params.id;
        const {productname,price,description,quantity,categories} = req.body;
        const oldData = await product.findAll({
            where:{
                productId
            }
        })
        var fileUrl;
        if(req.file){
            fileUrl = req.file.filename
            const oldImage =  oldData[0].productpicture;
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
            fileUrl = oldData[0].productpicture
        }
        const update = await product.update({
            productname,
            price,
            description,
            productpicture:fileUrl,
            quantity,
            categoryId :categories
        },{
            where:{
                productId
            }
        });
        if(!update){
            return res.send('Product not updated');
        }
        res.redirect('/vendor/vendordashboard');
    }
]
exports.deleteProduct = async(req,res)=>{
    const productId = req.params.id;
    const productData = await product.findOne({
        where:{
            productId
        }
    });
    if(!productData){
        return res.send('Product does not exist');
    }
    const deleteProduct = await product.destroy({
        where:{
            productId
        }
    });
    if(!deleteProduct){
        return res.send('Product not deleted');
    }
    res.redirect('/vendor/vendordashboard');
}
exports.searchProduct = async(req,res)=>{
    const vendorId = req.user;
    const {search} = req.body;
    const productData = await product.findAll({
        where:{
            vendorId,
            productname:{
                [Op.like]:'%'+search+'%'
            }
        }
    });
    if(!productData){
        return res.send('Product not found');
    }
    res.render('viewProduct',{products:productData});
}
exports.viewOrder = async (req, res) => {
    const vendorId = req.user; // Assuming req.user contains vendorId
    
    try {
        // Fetch vendor's products and their associated orderItems with status 'pending'
        const vendorData = await vendor.findOne({
            where: { vendorId },
            include: {
                model: product,
                include: [{
                    model: orderItem,
                    required: true,  // Ensure orderItems exist
                    include: [{
                        model: order,
                        required: true,  // Ensure orders exist
                        where: { status: 'pending' },
                        include: [{ 
                            model: user,  // Include user data
                            attributes: ['username', 'address', 'phonenumber'], // Select only needed fields
                        }]
                    }]
                }]
            }
        });
        
        

        if (!vendorData) {
            return res.send('Vendor does not exist');
        }

        if (vendorData.products.length === 0) {
            return res.send('No products found for this vendor.');
        }

        // Prepare orderData (products with their pending orders)
        const orderData = vendorData.products.reduce((acc, product) => {
            product.orderItems.forEach(orderItem => {
                acc.push({
                    product,
                    orderItem,
                    user: orderItem.order.user
                });
            });
            return acc;
        }, []);

        // Check if no pending orders exist
        if (orderData.length === 0) {
            return res.send('No pending orders found.');
        }
        // Render the orders with the pending status
        res.render('viewOrder', { orderData});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching vendor data.');
    }
};
exports.confirmOrder = async (req, res) => {
    const orderItemId = req.params.id;

    try {
        // Find the orderItem and include the product and its associated vendor, along with the order details
        const orderItemData = await orderItem.findOne({
            where: { orderItemId },
            include: [
                {
                    model: product,
                    include: [{ model: vendor }]
                },
                { model: order }
            ]
        });

        // Check if the orderItemData was found
        if (!orderItemData) {
            return res.send('Order item not found.');
        }

        // Check if the product has an associated vendor
        if (!orderItemData.product || !orderItemData.product.vendor) {
            return res.send('Vendor information not found for the product.');
        }

        // Check if the vendorId from the product matches the authenticated vendor
        if (orderItemData.product.vendor.vendorId !== req.user) {
            return res.send('Access denied. Order does not belong to this vendor.');
        }

        // Update the order status to 'confirmed' and assign the vendorId to the order
        const updateOrder = await order.update(
            {
                status: 'confirmed',
                vendorId: orderItemData.product.vendor.vendorId // Assign the correct vendorId
            },
            {
                where: { orderId: orderItemData.order.orderId }
            }
        );

        if (updateOrder[0] === 0) {
            return res.send('Error updating order status.');
        }

        // Redirect to view pending orders
        res.redirect('/vendor/viewOrder?status=pending');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error confirming order.');
    }
};

exports.renderResubmit = async (req, res) => {
    const vendorId = req.params.id;
    const vendorData = await vendor.findByPk(vendorId);
    if (!vendorData) {
        return res.send('Vendor not found.');
    }
    res.render('reapplyVendor.ejs', { vendorData });
}
exports.resubmit = [
    upload.single('photo'),
    async (req, res) => {
        const vendorId = req.params.id;
        const { shopname, phonenumber, email, password, address } = req.body;
        const oldData = await vendor.findAll({
            where:{
                vendorId
            }
        })
        var fileUrl;
        if(req.file){
            fileUrl = req.file.filename
            const oldImage =  oldData[0].photo;
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
            fileUrl = oldData[0].photo
        }
        try {
            // Prepare the updated fields
            const updateData = {
                shopname,
                email,
                password: bcrypt.hashSync(password, 1),
                phonenumber,
                address,
                status: 'pending'
            };
            if (req.file) {
                updateData.photo = fileUrl; // Only add photo if uploaded
            }

            // Perform update
            const [updatedRows] = await vendor.update(updateData, {
                where: {vendorId } // Make sure to use the correct column name
            });

            if (updatedRows === 0) {
                return res.send('Error updating vendor data: No vendor found with this ID.');
            }

            res.redirect('/login');
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }
];
exports.viewNotification = async (req, res) => {
    const vendorId = req.user;
    if (!vendorId) {
        return res.send('Vendor not found.');
    }
    const notifications = await notification.findAll({
        where: {
            vendorId,
            read_status: false
        }
    });
    const notificationCount = await notification.count({
        where: {
            vendorId,
            read_status: false
        }
    });
    res.render('notification.ejs', { notifications,notificationCount });
}
exports.readTrue = async (req, res) => {
    const notificationId = req.params.id;
    const notificationData = await notification.findByPk(notificationId);
    if (!notificationData) {
        return res.send('Notification not found.');
    }
    const updateNotification = await notification.update({
        read_status: true
    }, {
        where: { notificationId }
    });
    if (!updateNotification) {
        return res.send('Error updating notification.');
    }
    res.redirect('/vendor/notification');
}