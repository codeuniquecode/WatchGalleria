const express = require('express');
const router = express.Router();
// const vendorController = require('../controller/vendorController'); // Ensure correct import
const vendorController = require('../controller/vendorController');
const { isAuthenticated } = require('../middleware/isAuthenticated');
 const { approvedVendor } = require('../middleware/approvedVendor');
// GET
// router.get('/login', vendorController.login);
router.get('/forget', vendorController.forget);
router.get('/vendorRegister', vendorController.showVendorRegister); // Use the renamed function
router.get('/vendordashboard',isAuthenticated,approvedVendor, vendorController.vendorDashboard);
router.get('/addProduct',isAuthenticated,approvedVendor, vendorController.renderAddProduct);
router.get('/editProfile',isAuthenticated,approvedVendor, vendorController.renderEditProfile);
router.get('/logout', vendorController.logout);
router.get('/changePassword',isAuthenticated, vendorController.renderChangePassword);
router.get('/viewProduct',isAuthenticated,approvedVendor, vendorController.viewProduct);
router.get('/editProduct/:id',isAuthenticated,approvedVendor, vendorController.editProduct);
router.get('/deleteProduct/:id',isAuthenticated, vendorController.deleteProduct);
router.get('/viewOrder',isAuthenticated,approvedVendor, vendorController.viewOrder);
router.get('/confirmOrder/:id',isAuthenticated,approvedVendor, vendorController.confirmOrder);
// POST
router.post('/vendorRegister', vendorController.vendorRegister);
router.post('/addProduct',isAuthenticated, vendorController.addProduct);
router.post('/editVendor',isAuthenticated, vendorController.editProfile);
router.post('/vendorChangePassword',isAuthenticated, vendorController.changePassword);
router.post('/updateProduct/:id',isAuthenticated, vendorController.updateProduct);
router.post('/search',isAuthenticated, vendorController.searchProduct);
// router.post('/orderSearch', isAuthenticated, vendorController.searchOrder);
module.exports = router;
