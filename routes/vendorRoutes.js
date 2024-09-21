const express = require('express');
const router = express.Router();
// const vendorController = require('../controller/vendorController'); // Ensure correct import
const vendorController = require('../controller/vendorController');

// GET
// router.get('/login', vendorController.login);
router.get('/forget', vendorController.forget);
router.get('/vendorRegister', vendorController.showVendorRegister); // Use the renamed function

// POST
router.post('/vendorRegister', vendorController.vendorRegister);

module.exports = router;
