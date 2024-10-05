
const {user,vendor, sequelize} = require('../model/index');
const multer = require('../middleware/multerConfig').multer;

const storage = require('../middleware/multerConfig').storage;
const upload = multer({storage: storage});
const bcrypt = require('bcrypt');
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
exports.adminDashboard = (req,res)=>{
    res.send('admin dashboard here');
}
exports.logout= (req,res)=>{
    res.clearCookie('token');
    res.redirect('/');
}