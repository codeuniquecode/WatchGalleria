const jwt = require('jsonwebtoken');
const { vendor } = require('../model');
exports.approvedVendor = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const vendorData = await vendor.findOne({
            where: {
                vendorId: decoded.id
            }
        });
        if (vendorData.status === 'approved') {
            return next();
        }
        if(vendorData.status === 'pending'){
            return res.send('Your account is pending, please wait for approval');
        }
        if(vendorData.status === 'rejected'){
            return res.send('Your account has been rejected, please contact admin');
        }
        if(vendorData.status === 'blocked'){
            return res.send('Your account has been blocked, please contact admin');
            }
        return res.send('You are not an approved vendor');
    } catch (error) {
        return res.send('You are not an approved vendor');
    }
}