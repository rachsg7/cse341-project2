const { validationResult } = require('express-validator');
const User = require('../models/user');
const fileHelper = require('../util/file');

exports.getProfile = (req, res, next) => {
    const user = req.user;
    console.log(user);
    let username;
    if (!user.name) {
        username = user.email;
    } else {
        username = user.name;
    }
    const following = req.user.following.users.length;

    res.render('user/profile', {
        path: '/profile',
        pageTitle: 'Pictournal || Profile',
        username: username, // Change to user name
        posts: user.posts,
        following: following,
        user: user
    });
};

exports.getEditProfile = (req, res, next) => {
    const user = req.user;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('user/edit-profile', {
            path: '/profile',
            pageTitle: 'Edit Profile',
            validationErrors: errors.array(),
            user: user
        })
    } else {
        return res.render('user/edit-profile', {
            path: '/profile',
            pageTitle: 'Edit Profile',
            validationErrors: [],
            user: user
        })
    }
};

exports.postEditProfile = (req, res, next) => {
    const username = req.body.user_name;
    const bio = req.body.user_bio;
    const userId = req.body.userId;
    const image = req.file;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('user/edit-profile', {
            path: '/profile',
            pageTitle: 'Edit Profile',
            username: username,
            bio: bio,
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    User.findById(userId)
        .then(user => {
            if (user._id.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }
            user.name = username;
            user.bio = bio;
            if (image) {
                if (user.profileImgUrl) {
                    fileHelper.deleteFile(user.profileImgUrl);
                }
                user.profileImgUrl = image.path;
            }
            return user.save()
                .then(result => {
                    res.redirect('/profile');
                });
        });
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