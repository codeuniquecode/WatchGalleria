const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const {user,vendor, sequelize} = require('./model/index');
require('dotenv').config();
const multer = require('./middleware/multerConfig').multer;
const bcrypt = require('bcrypt');
const storage = require('./middleware/multerConfig').storage;
const upload = multer({storage: storage});
// const dbConfig = require('./config/dbConfig');
// const {user} = dbConfig;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true})); 
// app.use(express.json());

require("./model/index");

// routing
const userRoutes = require('./routes/userRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const loginRoutes = require('./routes/loginRoutes')
// Use userRoutes on the root path
app.use('/', userRoutes);

// Use vendorRoutes on a different path
app.use('/vendor', vendorRoutes);
app.use('/', loginRoutes);


app.listen(port,()=>{
    console.log(`the server is running on port ${port}`);
})