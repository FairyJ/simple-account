var User = require('../models/users');
const bodyParser = require('body-parser');

function editCommentGet(req, res, next) {
    for (let comment of res.locals.user.comments) {
        if (req.params.id == comment._id) {
            // console.log("comment ", comment.comment)
            res.locals.user['currentComment'] = comment;
        }
    }
    res.render('comments/editComment');
    next();
}

async function editCommentPost(req, res, next) {
    // console.log(JSON.stringify(req.body))
    await User.updateOne({ _id: res.locals.user._id, "comments._id": req.body.commentId }, { $set: { "comments.$.comment": req.body.comment } },
        (err, success) => {
            if (err) {
                res.locals.errors['commentsError'] = err.message;
                res.redirect("/comment");
            } else {
                res.redirect("/allComments")
            }
        })
    next();
}

exports.EditCommentGet = editCommentGet;
exports.EditCommentPost = editCommentPost;