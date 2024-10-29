const moment = require("moment");
const { user, order, vendor, product, notification } = require("../model");
const { Op, where } = require("sequelize");
const multer = require('../middleware/multerConfig').multer;
const storage = require('../middleware/multerConfig').storage;
const upload = multer({ storage: storage });
exports.renderAdminDashboard = async (req, res) => {
    try {
        const userCount = await user.count();
        const totaluser = userCount - 1;
        const vendorCount = await vendor.count(
            {
                where: {
                    status: ['approved', 'blocked']
            }
        }
        );
       

        const totalvendor = vendorCount;
        const orderCount = await order.count();
        const totalorder = orderCount;
        const productCount = await product.count();
        const totalproduct = productCount;
        
        return res.render('adminDashboard.ejs', {
            totaluser,
            totalvendor,
            totalorder,
            totalproduct
        });
    } catch (error) {
        console.error("Error fetching counts:", error);
        return res.status(500).send("An error occurred while fetching data.");
    }
};

exports.logout= (req,res)=>{
    res.clearCookie('token');
    return res.redirect('/');
}
exports.renderOrderStatus = async (req,res)=>{
    const orderData = await order.findAll({
        include:[
            {
                model:user,
                attributes:['username']
            }

        ]
    });
    return res.render('orderStatus.ejs',{orderData,moment});
}
exports.orderSearch = async (req,res)=>{
    const {orderStatus} = req.body;
    const orderData = await order.findAll({
        where:{
            status:orderStatus
        },
        include:[
            {
                model:user,
                attributes:['username']
            }
        ]
    });
    if(orderData.length==0){
        return res.send('invalid keyword');
    }
    return res.render('orderStatus.ejs',{orderData,moment});
}
exports.renderUserMgmt = async (req,res)=>{
    const userData = await user.findAll();
    return res.render('userMgmt.ejs',{userData});
}
exports.userSearch = async (req,res)=>{
    const {username} = req.body;
    const userData = await user.findAll({
        where:{
            username:{
                 [Op.like]:'%'+username+'%'
            }
        }
    });
    if(userData.length==0){
        return res.send('invalid keyword');
    }
    return res.render('userMgmt.ejs',{userData});
}
exports.deleteUser = async (req,res)=>{
    const {id} = req.params;
    const admin = await user.findOne({
        where:{
            userId:id
        }
    });
    if(admin.role=='admin'){
        const userData = await user.findAll();
        return res.render('userMgmt.ejs',{message:'Admin Account cannot be deleted',userData});
    }
    const del=await user.destroy({
        where:{
            userId:id
        }
    });
    if(del){
        const userData = await user.findAll();
        return res.render('userMgmt.ejs',{message:'User Deleted Successfully',userData});
    }
    else{
        return res.send('user doesnt exists');
    }
    
}
exports.renderEditUser = async (req,res)=>{
    const {id} = req.params;
    const userData = await user.findAll({
        where:{
            userId:id
        }
    });
    if(userData.length==0){
        return res.send('user doesnt exists');
    }
    return res.render('adminEditUser.ejs',{userData:userData[0]});
}
exports.editUser =[upload.single('photo'),async(req,res)=>{
    const userId = req.params.id;
    const {name,phone,email,address} = req.body;
    const oldData = await user.findOne({
        where:{
            userId
        }
    })
    var fileUrl;
    if(req.file){
        fileUrl = req.file.filename
        const oldImage =  oldData.profilepic;
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
        fileUrl = oldData.profilepic
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
            const userData = await user.findAll();
        return res.render('userMgmt.ejs',{message:'User Profile Updated Successfully',userData});
        }
    }
    else{
        return res.send('user doesnt exists');
    }
  
}
]
exports.searchVendor = async (req,res)=>{
    const {shopname} = req.body;
    const vendorData = await vendor.findAll({
        where:{
            shopname:{
                [Op.like]:'%'+shopname+'%'
            }
        }
    });
    if(vendorData.length==0){
        return res.send('invalid keyword');
    }
    return res.render('vendorApproval.ejs',{vendorData});
}
exports.renderApproveVendor = async (req,res)=>{
    const vendorData = await vendor.findAll({
        where:{
            status:'pending'
        }
    });
    return res.render('vendorApproval.ejs',{vendorData});
}
exports.approveVendor = async (req,res)=>{
    const vendorId = req.params.id;
    const approve = await vendor.update({
        status:'approved'
    },{
        where:{
            vendorId
        }
    });
    if(approve){
        const vendorData = await vendor.findAll({
            where:{
                status:'pending'
            }
        });
        return res.render('vendorApproval.ejs',{message:'Vendor Approved Successfully',vendorData});
    }
    else{
        return res.send('vendor doesnt exists');
    }
}

exports.rejectVendor = async (req,res)=>{
    const vendorId = req.params.id;
    const approve = await vendor.update({
        status:'rejected'
    },{
        where:{
            vendorId
        }
    });
    if(approve){
        const vendorData = await vendor.findAll({
            where:{
                status:'pending'
            }
        });
        return res.render('vendorApproval.ejs',{message:'Vendor Rejected Successfully',vendorData});
    }
    else{
        return res.send('vendor doesnt exists');
    }
}
exports.renderVendorMgmt = async (req,res)=>{
    const vendorData = await vendor.findAll(
        {
            where:{
                status: ['approved', 'blocked']
            }
        }
    );
    return res.render('vendorMgmt.ejs',{vendorData});
}
exports.shopnameSearch = async (req,res)=>{
    const {shopname} = req.body;
    const vendorData = await vendor.findAll({
        where:{
            shopname:{
                [Op.like]:'%'+shopname+'%'
            }
        }
    });
    if(vendorData.length==0){
        return res.send('invalid keyword');
    }
    return res.render('vendorMgmt.ejs',{vendorData});
}
exports.deleteVendor = async (req,res)=>{
    const {id} = req.params;
    const del=await vendor.destroy({
        where:{
            vendorId:id
        }
    });
    if(del){
        const vendorData = await vendor.findAll({
            where:{
                status: ['approved', 'blocked']
            }
        });
        return res.render('vendorMgmt.ejs',{message:'Vendor Deleted Successfully along with their products',vendorData});
    }
    else{
        return res.send('vendor doesnt exists');
    }
    
}

exports.blockVendor = async (req,res)=>{
    const vendorId = req.params.id;
    const approve = await vendor.update({
        status:'blocked'
    },{
        where:{
            vendorId
        }
    });
    if(approve){
        const vendorData = await vendor.findAll({
            where:{
                status: ['approved', 'blocked']
            }
        });
        return res.render('vendorMgmt.ejs',{message:'Vendor Blocked Successfully',vendorData});
    }
    else{
        return res.send('vendor doesnt exists');
    }
}

exports.unblockVendor = async (req,res)=>{
    const vendorId = req.params.id;
    const approve = await vendor.update({
        status:'approved'
    },{
        where:{
            vendorId
        }
    });
    if(approve){
        const vendorData = await vendor.findAll({
            where:{
                status: ['approved', 'blocked']
            }
        });
        return res.render('vendorMgmt.ejs',{message:'Vendor unblocked Successfully',vendorData});
    }
    else{
        return res.send('vendor doesnt exists');
    }
}
exports.renderEditVendor = async (req,res)=>{
    const {id} = req.params;
    const vendorData = await vendor.findAll({
        where:{
            vendorId:id
        }
    });
    if(vendorData.length==0){
        return res.send('user doesnt exists');
    }
    return res.render('adminEditVendor.ejs',{vendorData:vendorData[0]});
}

exports.editVendor =[upload.single('photo'),async(req,res)=>{
    const vendorId = req.params.id;
    const {shopname,phonenumber,email,address} = req.body;
    const oldData = await vendor.findOne({
        where:{
            vendorId
        }
    })
    var fileUrl;
    if(req.file){
        fileUrl = req.file.filename
        const oldImage =  oldData.profilepic;
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
        fileUrl = oldData.profilepic
    }
    if(vendorId){
         const update = await vendor.update({
            shopname,
            phonenumber,
            email,
            address,
            profilepic:fileUrl
        },{
            where:{
                vendorId
            }
        });
        if (update) {
            const vendorData = await vendor.findAll();
        return res.render('vendorMgmt.ejs',{message:'Vendor Profile Updated Successfully',vendorData});
        }
    }
    else{
        return res.send('vendor doesnt exists');
    }
  
}
]
exports.renderProductMgmt = async (req,res)=>{
    const productData = await product.findAll();
    return res.render('productMgmt.ejs',{productData});
}
exports.productSearch = async (req,res)=>{
    const {productname} = req.body;
    const productData = await product.findAll({
        where:{
            productname:{
                [Op.like]:'%'+productname+'%'
            }
        }
    });
    if(productData.length==0){
        return res.send('invalid keyword');
    }
    return res.render('productMgmt.ejs',{productData});
}
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        // Step 1: Find the product along with the associated vendor
        const productToDelete = await product.findOne({
            where: { productId: id },
            include: [{ model: vendor, attributes: ['vendorId'] }]
        });

        if (!productToDelete) {
            return res.send('Product does not exist');
        }

        // Step 2: Store the vendorId
        const vendorId = productToDelete.vendor?.vendorId;
        const productName = productToDelete.productname;
        // Step 3: Delete the product
        const del = await product.destroy({
            where: { productId: id }
        });

        if (del) {
            // Use the stored IDs to create the notification
            const notify = await notification.create({
                type: 'deleted',
                vendorId: vendorId,
                message: `Product with ID ${id} and name ${productName}  has been deleted`
            }).catch(err => {
                console.error("Error creating notification:");
                return res.send("Notification creation error");
            });
            // Fetch updated product data for rendering
            const productData = await product.findAll();

            return res.render('productMgmt.ejs', { message: 'Product Deleted Successfully', productData });
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).send('An error occurred while deleting the product');
    }
};


exports.renderEditProduct = async (req,res)=>{
    const {id} = req.params;
    const productData = await product.findAll({
        where:{
            productId:id
        }
    });
    if(productData.length==0){
        return res.send('product doesnt exists');
    }
    return res.render('adminEditProduct.ejs',{productData:productData[0]});
}
exports.editProduct =[upload.single('product_photo'),async(req,res)=>{
    const productId = req.params.id;
    const {productname,price,description,quantity,categories} = req.body;
    const oldData = await product.findOne({
        where:{
            productId
        }
    })
    var fileUrl;
    if(req.file){
        fileUrl = req.file.filename
        const oldImage =  oldData.productpic;
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
        fileUrl = oldData.productpic
    }
    if(productId){
         const update = await product.update({
            productname,
            price,
            description,
            productpic:fileUrl,
            quantity,
            category:categories
        },{
            where:{
                productId
            }
        });
        if (update) {
            const productData = await product.findAll();
        return res.render('productMgmt.ejs',{message:'Product Updated Successfully',productData});
        }
    }
    else{
        return res.send('product doesnt exists');
    }
  
}
]