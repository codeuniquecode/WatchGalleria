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


//POST -- request
router.post('/orderSearch',isAdmin,adminController.orderSearch);
module.exports = router;