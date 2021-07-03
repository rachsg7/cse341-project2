const Posts = require('../models/post');
const Comment = require('../models/comment');

exports.getIndex = (req, res, next) => {
    Posts.find()
        .then(posts => {
            res.render('index', {
                posts: posts,
                pageTitle: 'Welcome to Pictournal',
                path: '/',
                user: req.user
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};