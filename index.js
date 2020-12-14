
const express = require("express");
require("dotenv").config();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const jsonwebtoken = require('jsonwebtoken');

const userSignup = require('./handlers/signup.js');
const signUpValidate = require('./handlers/validator.js');
const userLogin = require('./handlers/login.js');
const myToken = require('./handlers/token.js');
const editCommentGet = require('./handlers/editComment');
const editCommentPost = require('./handlers/editComment');
const deleteComment = require('./handlers/deleteComment');


// mongoose.model will take the value (User) and make it lowercase and plural and create collection from it . 
//we save this mongoose.model  into variable User variable which that will give us model class .
var User = require('./models/users');
const Confirmation = require("./models/confirmation.js");

var app = express();
const PORT = process.env.PORT || 3000;
// const { nextTick, exit } = require("process");

//secret key is a string or array used for signing cookies
const key = process.env.SECRET;

// View engine setup 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static('public'));

//all middleware should go before all of routes if put after route have to call next function for all of them 
//use body_parser to parse data in body we will need to add into middleware model.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//to get cookie we need to parse the cookie
app.use(cookieParser());

//res.local is an object that contains response local variables scoped to the request,
//this will be available only to the view(s) rendered during that request / response cycle (if any).
app.use((req, res, next) => {
    res.locals.errors = {};
    next();
})

//root route
app.get('/', (req, res) => {
    res.render('home');
    // console.dir(res.headersSent)
})

// signup route
app.get('/signup', (req, res) => {
    // Rendering signup.ejs page 
    res.render('signup');
})

app.get('/confirmEmail/:confirmationId', async (req, res, next) => {
    try {
        // console.log(`confirmationId: ${req.params.confirmationId}`);
        let result = await Confirmation.findOneAndDelete({ confirmationId: req.params.confirmationId });
        if (result) {
            // console.log(`confirmation result : ${result}`)
            result = await User.updateOne({ _id: result.userId }, { $set: { "active": true } });
            // console.log(`activate user : ${result}`);
        }
        res.redirect('/login');
    } catch (err) {
        next(new Error(`email confirmation failed with error : ${err.message}`))
    }
})


//login page route
app.get('/login', (req, res) => {
    // Rendering login.ejs page 
    res.render('login');
})

//welcome page route after user successfully logged in 
app.get('/welcome', myToken.Token, (req, res) => {
    res.render('welcome');
});

//comment page route 
app.get('/comment', myToken.Token, (req, res) => {
    res.render('comments/comment');
});

//all comments page route
app.get('/allComments', myToken.Token, (req, res) => {
    res.render('comments/allComments');
});

app.get('/editComment/:id',
    myToken.Token,
    editCommentGet.EditCommentGet)


app.get('/deleteComment/:id',
    myToken.Token,
    deleteComment.DeleteComment
)

//logout page route
app.get('/logout', (req, res) => {
    res.clearCookie('accessCookie');
    res.redirect('/');
})


// check the validation first if everything is good then save all the information in Database
app.post('/signup',
    signUpValidate.userValidationResult,
    signUpValidate.validation,
    userSignup.Signup
);

//if all information user input in login page are correct will go to the welcome page 
app.post('/login', userLogin.Login);

app.post('/comment', myToken.Token, (req, res, next) => {
    // console.log(req.body.comment);
    // console.log("userId :" , res.locals.user._id);
    User.findOneAndUpdate({ _id: res.locals.user._id }, { $push: { "comments": { "comment": req.body.comment } } },
        (err, success) => {
            if (err) {
                res.locals.errors['commentsError'] = err.message;
                res.redirect("/comment");
            } else {
                // console.log(success);
                res.redirect("/allComments")
            }
        }
    )
});

//save all changes happened in editComment page
app.post('/editComment',
    myToken.Token,
    editCommentPost.EditCommentPost)

app.use((err, req, res, next) => {
    console.log(err.message);
    res.redirect('/')
})

app.all('/*', (req, res) => {
    res.redirect('/')
})
//listener should be at the end of this file
app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
})