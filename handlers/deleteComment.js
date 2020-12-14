var User = require('../models/users');
const bodyParser = require('body-parser');

async function deleteComment(req, res, next) {
    // console.log("comments", JSON.stringify(res.locals.user.comments));
    // console.log(req.params.id)
    // console.log((req.method))
    // console.log((req.url))
    await User.findOneAndUpdate({ _id: res.locals.user._id }, { $pull: { "comments": { "_id": req.params.id } } }, (err, success) => {
        if (err) {
            console.log(err.message)
        } else {
            // console.log(`success :  ${success}`)
            res.redirect('/allComments')
        }
    })
    next();
}

exports.DeleteComment = deleteComment;