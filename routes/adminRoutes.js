const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const {isAdmin}= require('../middleware/isAdmin')
// const multer = require('../middleware/multerConfig').multer;
// const storage = require('../middleware/multerConfig').storage;
// const upload = multer({storage: storage});
//GET -- request
router.get('/adminDashboard',isAdmin,adminController.renderAdminDashboard);
router.get('/logout',adminController.logout);
router.get('/orderStatus',isAdmin,adminController.renderOrderStatus);
router.get('/userMgmt',isAdmin,adminController.renderUserMgmt);
router.get('/deleteUser/:id',isAdmin,adminController.deleteUser);
router.get('/editUser/:id',isAdmin,adminController.renderEditUser);
router.get('/approveVendor',isAdmin,adminController.renderApproveVendor);
router.get('/approved/:id',isAdmin,adminController.approveVendor);
router.get('/rejected/:id',isAdmin,adminController.rejectVendor);
router.get('/vendorMgmt',isAdmin,adminController.renderVendorMgmt);
router.get('/deleteVendor/:id',isAdmin,adminController.deleteVendor);
router.get('/blockVendor/:id',isAdmin,adminController.blockVendor);
router.get('/unblockVendor/:id',isAdmin,adminController.unblockVendor);
router.get('/editVendor/:id',isAdmin,adminController.renderEditVendor);
router.get('/productMgmt',isAdmin,adminController.renderProductMgmt);
router.get('/deleteProduct/:id',isAdmin,adminController.deleteProduct);
router.get('/editProduct/:id',isAdmin,adminController.renderEditProduct);
//POST -- request
router.post('/orderSearch',isAdmin,adminController.orderSearch);
router.post('/userSearch',isAdmin,adminController.userSearch);
router.post('/searchVendor',isAdmin,adminController.searchVendor);   
router.post('/editUser/:id',isAdmin,adminController.editUser);
router.post('/shopnameSearch',isAdmin,adminController.shopnameSearch);
router.post('/editVendor/:id',isAdmin,adminController.editVendor);
router.post('/productSearch',isAdmin,adminController.productSearch);
router.post('/editProduct/:id',isAdmin,adminController.editProduct);
module.exports = router;