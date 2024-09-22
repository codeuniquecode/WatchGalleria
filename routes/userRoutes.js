const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

// GET
router.get('/',userController.home);
router.get('/cs',userController.cs);
// router.get('/login',userController.login);
router.get('/signup',userController.signup);
router.get('/forget',userController.forget);
router.get('/admin',userController.adminDashboard);

// POST
router.post('/register',userController.register);

module.exports = router;