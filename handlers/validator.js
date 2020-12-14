
const { body, validationResult } = require('express-validator');

const userValidationResult =
    [
        body('firstName')
            .isString()
            .notEmpty()
            .withMessage('name should be string')
        ,

        body('lastName')
            .isString()
            .notEmpty()
            .withMessage('name should be string')
        ,

        body('email')
            .isEmail()
            .notEmpty()
            .withMessage('should be Email, try again'),


        body('password')
            .notEmpty()
            .isLength({ min: 5 })
            .withMessage('password should be longer the 5 character'),

        body('confirmPassword')
            .custom(async (value, { req }) => {
                if (value === req.body.password) {
                    return true
                } else {
                    throw new Error("password and confirmation password are not match, try again!")
                }
            })
    ]


const validate = (req, res, next) => {
    //res.local is an object that contains response local variables scoped to the request,
    //this will be available only to the view(s) rendered during that request / response cycle (if any).
    //and here we will save the result of our validation into the res.local.validationErrors
    //which we create in our res.local
    res.locals.validationErrors = validationResult(req);
    next();
}

exports.validation = validate;
exports.userValidationResult = userValidationResult;


