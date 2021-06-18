const { validationResult } = require('express-validator');

exports.getProfile = (req, res, next) => {
    res.render('user/profile', {
        path: '/profile',
        pageTitle: 'Pictournal || Profile'
    });
};

exports.getEditProfile = (req, res, next) => {
    // const user_bio = req.body.user_bio;
    // const user_name = req.body.user_name;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('user/edit-profile', {
            path: '/profile',
            pageTitle: 'Edit Profile',
            validationErrors: errors.array(),
            // originalInput: {
            //     user_bio: user_bio,
            //     user_name: user_name
            // }
        })
    } else {
        return res.render('user/edit-profile', {
            path: '/profile',
            pageTitle: 'Edit Profile',
            validationErrors: []
        })
    }

};

exports.getFollowing = (req, res, next) => {
    res.render('user/follow-list', {
        path: '/profile',
        pageTitle: 'Following'
    })
};


exports.getFeed = (req, res, next) => {
    res.render('user/feed', {
        path: '/feed',
        pageTitle: 'Feed',
    })
};

exports.newPost = (req, res, next) => {
    res.render('user/newPost', {
        path: '/newPost',
        pageTitle: 'New Post',
    })
};