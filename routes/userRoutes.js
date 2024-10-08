const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { isAuthenticated } = require('../middleware/isAuthenticated');
const multer = require('../middleware/multerConfig').multer;
const storage = require('../middleware/multerConfig').storage;
const upload = multer({storage: storage});

// GET
router.get('/',userController.home);
router.get('/cs',userController.cs);
router.get('/signup',userController.signup);
router.get('/forget',isAuthenticated,userController.forget);
router.get('/admin',isAuthenticated,userController.adminDashboard);
router.get('/logout',userController.logout);
router.get('/editProfile',isAuthenticated,userController.editProfile);
router.get('/changePassword',isAuthenticated,userController.renderChangePassword);
// POST
router.post('/register',userController.register);// Route with file upload middleware
router.post('/updateProfile', isAuthenticated, upload.single('photo'), userController.updateProfile);
router.post('/changePassword', isAuthenticated, userController.changePassword);
module.exports = router;