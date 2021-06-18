const Posts = require('../models/post');

exports.getIndex = (req, res, next) => {
    Posts.find()
        .then(posts => {
            res.render('index', {
                posts: posts,
                pageTitle: 'Welcome to Pictournal',
                path: '/'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

};