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

//POST -- request
router.post('/orderSearch',isAdmin,adminController.orderSearch);
router.post('/userSearch',isAdmin,adminController.userSearch);

router.post('/editUser/:id',isAdmin,adminController.editUser);
module.exports = router;