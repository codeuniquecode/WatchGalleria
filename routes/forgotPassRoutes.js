const express = require('express');
const router = express.Router();
const forgotController = require('../controller/forgetPasswController');

router.get('/forget',forgotController.renderForget);

router.post('/handleMail',forgotController.handleMail);
router.post('/otpVerify',forgotController.otpVerify);
router.post('/resetPassword',forgotController.resetPassword);
module.exports = router;