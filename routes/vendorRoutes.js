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
// POST
router.post('/vendorRegister', vendorController.vendorRegister);

module.exports = router;
