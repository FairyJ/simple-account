
// const validate = require('./handlers/validator');
var User = require('../models/users');

const nodeMailer = require('nodemailer');
const crypto = require('crypto');
const Confirmation = require('../models/confirmation');

const transporter = nodeMailer.createTransport({
    service: "Hotmail",
    auth: {
        user: 'csuncomp484@hotmail.com',
        pass: 'finalJFNRN'
    }
});

async function signup(req, res, next) {
    // at first check there is no error for input variables
    // console.log(JSON.stringify(req.body));
    // creat variable and store each input into it and the create object 
    // console.log(JSON.stringify(res.locals.validationErrors.errors));
    if (res.locals.validationErrors.errors.length === 0) {
        //define my user
        var user = undefined;
        try {
            user = await User.findOne({ email: req.body.email }).exec();
        } catch (err) {
            //give error
            console.log(err.message);
            //exit from here
        }
        var hashKey = crypto.randomBytes(64).toString('hex');
        if (!user) {
            //if user is not already exist create new user object from User model
            let newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
            });
            try {
                //save the new user into DB using .save
                let result = await newUser.save();
                // console.log(`user saver : ${result}`);
                result = await new Confirmation({
                    userId: result._id,
                    confirmationId: hashKey
                }).save();
                // console.log(`confirmation save ${result}`);
            } catch (err) {
                res.locals.errors["mongodb"] = err.message;
                return res.render('signup');
            }
            const option = {
                from: "csuncomp484@hotmail.com",
                to: req.body.email,
                subject: "Authorizing",
                html: `<p>Hello ${req.body.firstName.charAt(0).toUpperCase()}${req.body.firstName.slice(1)} ${req.body.lastName.charAt(0).toUpperCase()}${req.body.lastName.slice(1)},</p>
                <br>
                <p>Thank you for signing up!!</p>
                <p>in order to use your account you need to activate it by clicking link below</p>
                <a href = "${process.env.ROOT_URL}/confirmEmail/${hashKey}">click here</a><br>
                <p>Thank You</p>`
            }
            //after create user send email with active value of false
            try {
                const email = await transporter.sendMail(option)
                // console.log(JSON.stringify(email));
            } catch (err) {
                console.log(`error :  ${err}`);
            }
            return res.render('activation');

        } else {
            //already exist
            if (user.active) {
                return res.render('login');
                //if user is not active
            } else {
                const option = {
                    from: "csuncomp484@hotmail.com",
                    to: req.body.email,
                    subject: "Authorization",
                    html: `<p>Hello ${req.body.firstName.charAt(0).toUpperCase()}${req.body.firstName.slice(1)} ${req.body.lastName.charAt(0).toUpperCase()}${req.body.lastName.slice(1)},</p>
                    <br>
                    <p>Thank you for signing up!!</p>
                    <p>in order to use your account you need to activate it by clicking link below</p>
                    <a href = "${process.env.ROOT_URL}/confirmEmail/${hashKey}">click here</a><br>
                    <p> Thank You </p>`
                }
                // send email
                try {
                    const result = await Confirmation.updateOne({userId : user._id} , { $set: { "confirmationId": hashKey} })
                    const email = await transporter.sendMail(option)
                    console.log(JSON.stringify(email));
                } catch (err) {
                    console.log(`error ${err}`);
                }
                return res.render('activation');
            }
        }
    } else {
        //write all errors into locals
        for (let error of res.locals.validationErrors.errors) {
            if (error.param === "password") {
                res.locals.errors["password"] = error.msg;
            }
            else if (error.param === "email") {
                res.locals.errors["email"] = error.msg;
            }
            else if (error.param === "firstName") {
                res.locals.errors["firstName"] = error.msg;
            }
            else if (error.param === "lastName") {
                res.locals.errors["lastName"] = error.msg;
            }
            else if (error.param === "confirmPassword") {
                res.locals.errors["confirmPassword"] = error.msg;
            }
        }
        return res.render('signup');
    }
    return next()
}
//exports.module here our module is Signup we export it then we can use it in index.js
exports.Signup = signup;

