
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/users');

const key = process.env.SECRET;

async function token(req, res, next) {
    try {
        const token = req.cookies.accessCookie;
        if (token) {
            decoded = jsonwebtoken.verify(token, key);

            // console.log("this is decoded:", decoded);
            const user = await User.findOne({ _id: decoded.userId })
            if (!user) {
                res.redirect('/logout');
                next(new Error("user doesn't exist"));
            } else {
                res.locals.user = user;
                next();
            }
        } else {
            next(new Error("NO token"));
            
        }
    } catch (err) {
        res.redirect('/logout');
        next(new Error(`something went wrong. Error message : ${err.message} `));
    }

}

exports.Token = token;
