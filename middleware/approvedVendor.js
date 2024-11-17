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
            return res.render('showMessage.ejs', { message: 'Your account is pending, please wait for approval' });
        }
        if (vendorData.status === 'rejected') {
            const vendorId = req.user; // Assuming req.user contains the vendor's ID
            return res.send(`
                <div>
                    <p>Your application has been rejected. Please <a href="/vendor/resubmit/${vendorId}">click here</a> to update and resubmit your application.</p>
                </div>
            `);
        }
        
        if(vendorData.status === 'blocked'){
            return res.render('showMessage.ejs', { message: 'Your account has been blocked! You cannot perform any operations or view the dashboard, please contact admin' });
            }
        return res.send('You are not an approved vendor');
    } catch (error) {
        return res.send('You are not an approved vendor');
    }
}