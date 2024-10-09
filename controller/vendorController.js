
const {user,vendor, sequelize, product} = require('../model/index');
const multer = require('../middleware/multerConfig').multer;
const storage = require('../middleware/multerConfig').storage;
const upload = multer({ storage: storage });
const bcrypt = require('bcrypt');

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
        }
    })
    if(!vendorData){
        return res.send('Vendor does not exist');
    }
    if(vendorData.role !== 'vendor'){
        return res.send('Access Denied ! Login as a vendor to view this page');
    }
    res.render('vendorDashboard',{vendorData});
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