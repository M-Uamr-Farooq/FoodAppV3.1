const express = require('express');
const router = express.Router();
const buyerAuthController = require('../controllers/buyerAuthController');

router.post('/buyer-send-otp', buyerAuthController.sendBuyerOtp);
router.post('/buyer-signup', buyerAuthController.verifyBuyerOtpAndSignup);
router.post('/buyer-signin', buyerAuthController.buyerSignin);

module.exports = router;