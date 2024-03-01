const express = require("express");
const app = express();
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

dotenv.config({path:'./config/config.env'});

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const users = [
    {username: "tom", password: "123"},
]

app.get('/', async(req,res) => {

    const {token} = req.cookies;
    console.log(token);

    if(token) {
        
        jwt.verify(token,process.env.JWT_SECRET_KEY, (err, result) => {                   // callback fun

            console.log("Verify.....");
            
            if(result) {
                console.log(result);

                res.redirect('/profile');

            } else {

                console.log("Else.....");
                res.sendFile(__dirname + '/login.html');                
            }
        });      

    } else {
        res.sendFile(__dirname + '/login.html');
    }

});

app.post('/', async(req,res) => {

    const {username, password} = req.body;

    const user = users.find((item) => item.username === username && item.password === password)

    if(!user) {

        res.redirect('/')

    } else {

        const data = {
            username, 
            time: Date(),
        }

        const token = jwt.sign(data, process.env.JWT_SECRET_KEY,{expiresIn:'10min'});

        res.cookie('token', token).redirect('/profile');

    }

    console.log(req.body);

});

app.get('/profile', async(req,res) => {
    res.sendFile(__dirname + '/profile.html');
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
});