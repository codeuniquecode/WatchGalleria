
const {user,vendor, sequelize} = require('../model/index');
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
exports.adminDashboard = (req,res)=>{
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