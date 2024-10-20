
const {user,vendor, sequelize, product, order, Sequelize, orderItem} = require('../model/index');
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
    res.render('vendorDashboard',{vendorData,productCount,orderCount,totalSales});
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
    res.redirect('/');
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