const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { isAuthenticated } = require('../middleware/isAuthenticated');

// GET
router.get('/',userController.home);
router.get('/cs',userController.cs);
// router.get('/login',userController.login);
router.get('/signup',userController.signup);
router.get('/forget',isAuthenticated,userController.forget);
router.get('/admin',isAuthenticated,userController.adminDashboard);
router.get('/logout',userController.logout);
// POST
router.post('/register',userController.register);

module.exports = router;