const express = require('express');
const router = express.Router();
// const vendorController = require('../controller/vendorController'); // Ensure correct import
const vendorController = require('../controller/vendorController');
const { isAuthenticated } = require('../middleware/isAuthenticated');

// GET
// router.get('/login', vendorController.login);
router.get('/forget', vendorController.forget);
router.get('/vendorRegister', vendorController.showVendorRegister); // Use the renamed function
router.get('/vendordashboard',isAuthenticated, vendorController.vendorDashboard);
router.get('/addProduct',isAuthenticated, vendorController.renderAddProduct);
router.get('/editProfile',isAuthenticated, vendorController.renderEditProfile);
router.get('/logout', vendorController.logout);
router.get('/changePassword',isAuthenticated, vendorController.renderChangePassword);
router.get('/viewProduct',isAuthenticated, vendorController.viewProduct);
router.get('/editProduct/:id',isAuthenticated, vendorController.editProduct);
router.get('/deleteProduct/:id',isAuthenticated, vendorController.deleteProduct);

// POST
router.post('/vendorRegister', vendorController.vendorRegister);
router.post('/addProduct',isAuthenticated, vendorController.addProduct);
router.post('/editVendor',isAuthenticated, vendorController.editProfile);
router.post('/vendorChangePassword',isAuthenticated, vendorController.changePassword);
router.post('/updateProduct/:id',isAuthenticated, vendorController.updateProduct);
router.post('/search',isAuthenticated, vendorController.searchProduct);
module.exports = router;
