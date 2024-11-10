const { vendor } = require("../model");

exports.restrictVendor = async (req, res, next) => {
    // Ensure the user is logged in
    const userId = req.user;

    if (!userId) {
        // If not logged in, render the homepage or redirect
        return res.render('index.ejs'); 
    }

    try {
        // Check if the logged-in user is a vendor
        const vendorData = await vendor.findOne({ where: { vendorId: userId } });

        // If the user is a vendor, redirect them
        if (vendorData) {
            return res.redirect('/vendor/vendordashboard') // Or redirect them as needed (e.g., res.redirect('/vendor/vendordashboard'))
        }

        // If not a vendor, continue to the next middleware/route
        next();
    } catch (error) {
        console.error("Error checking vendor data:", error);
        // You could send a server error response if necessary
        return res.status(500).send('Internal Server Error');
    }
};
