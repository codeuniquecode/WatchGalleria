const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

//routing codes
app.get('/',(req,res)=>{
    res.render('index.ejs');
})
app.get('/cs',(req,res)=>{
    res.render('cs');
})
app.get('/login',(req,res)=>{
    res.render('login');
})
app.get('/signup',(req,res)=>{
    res.render('signup');
})
app.get('/forgot',(req,res)=>{
    res.render('forgot');
})
app.get('/vendorsignup',(req,res)=>{
    res.render('vendorsignup');
})




app.listen(port,()=>{
    console.log(`the server is running on port ${port}`);
})