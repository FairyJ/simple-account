var User = require('../models/users');
const jsonwebtoken = require('jsonwebtoken');

//secret key
const key = process.env.SECRET;

async function login(req, res, next) {
    //take input from user and store into variable 
    await User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                // console.log("user");
                return res.render("login");
            } else {
                if (user.active) {
                    if (user.password === req.body.password) {
                        //create token jsonwebtoken.sign(payload , secret) payload 
                        const token = jsonwebtoken.sign({
                            userId: user._id,
                            email: user.email,
                        }, key)
                        // console.log('token : ' , token);
                        // console.log('Cookies: ', req.cookies);
                        // console.log('Signed Cookies: ', req.signedCookies);
                        //set the token into cookie
                        //accessCookie is name of our cookie, token is the value (all data ) 
                        res.cookie('accessCookie', token, {
                            // maxAge: 3600,
                        });
                        res.locals.user = user;
                        // console.log(res.locals);
                        // res.send('send the cookie');
                        return res.render("welcome");
                        // console.log('userId:' , jsonwebtoken.decode(token).userId);
                        // console.log('first name:' , jsonwebtoken.decode(token).firstName);
                        // console.log('email:',jsonwebtoken.decode(token).email);
                    } else {
                        // console.log("pass wrong");
                        res.locals.errors["loginError"] = "email or password is wrong,Try again!";
                        return res.render("login");
                    }
                } else {
                    return res.render('activation');
                }
            }
        }).catch(err => {
            errMes = err.message;
            return res.render('login', {
                errMes,
            })
            // console.log(err.message);
        })
    next();
}

exports.Login = login;
