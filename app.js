const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const {user,vendor, sequelize} = require('./model/index');
require('dotenv').config();
const multer = require('./middleware/multerConfig').multer;
const bcrypt = require('bcrypt');
const storage = require('./middleware/multerConfig').storage;
const upload = multer({storage: storage});
// const dbConfig = require('./config/dbConfig');
// const {user} = dbConfig;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true})); 
require("./model/index");
//routing codes -- GET
app.get('/',(req,res)=>{
    res.render('index.ejs');
})
app.get('/cs',(req,res)=>{
    res.render('cs');
})
app.get('/login',(req,res)=>{
    res.render('login');
})
app.get('/signup',(req,res)=>{
    res.render('signup');
})
app.get('/forgot',(req,res)=>{
    res.render('forgot');
})
app.get('/vendorRegister',(req,res)=>{
    res.render('vendorsignup');
})
// app.get('/vendorRegister',(req,res)=>{
//     // res.render('vendorsignup');
//     res.send('success');
// })

//POST
app.post('/register' ,upload.single('image'), async (req, res)=>{
    const {fullname, phonenumber, email, password, address} = req.body;
    await user.create({
        username : fullname,
        phonenumber : phonenumber,
        email:email,
        password: bcrypt.hashSync(password,1),
        address:address,
        profilepic:req.file.filename
    })
    res.redirect('/login')
})
app.post('/vendorRegister',upload.single('photo'), async(req,res)=>{
    const {shopname, phonenumber,email,password,address} = req.body;
    await vendor.create({
        shopname: shopname,
        email :email,
        password: bcrypt.hashSync(password,1),
        phonenumber:phonenumber,
        address:address,
        photo: req.file.filename
    })
    res.redirect('/login')
    // console.log(email,password);

})


app.listen(port,()=>{
    console.log(`the server is running on port ${port}`);
})