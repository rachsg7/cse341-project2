const { validationResult } = require('express-validator');
const User = require('../models/user');
const fileHelper = require('../util/file');

// exports.getProfile = (req, res, next) => {
//     const user = req.user;
//     console.log(user);
//     let username;
//     if (!user.name) {
//         username = user.email;
//     } else {
//         username = user.name;
//     }
//     const following = req.user.following.users.length;

//     res.render('user/profile', {
//         path: '/profile',
//         pageTitle: 'Pictournal || Profile',
//         username: username,
//         posts: user.posts,
//         following: following,
//         user: user
//     });
// };

exports.getProfile = (req, res, next) => {
    const visiting = req.params.userId;

    User.findById(visiting)
        .then(user => {
            const mainUser = req.user;
            const username = user.name;
            const following = user.following.users.length;
            // If the user is the owner of the Profile, they are allowed to edit
            if (mainUser._id.toString() == visiting.toString()) {
                return res.render('user/profile', {
                    path: '/profile',
                    pageTitle: 'Pictournal || Profile',
                    username: username,
                    posts: user.posts,
                    following: following,
                    user: user,
                    profileUser: user,
                    canEdit: true
                });
            }
            // If the user does not own the profile, they cannot edit
            return res.render('user/profile', {
                path: '/profile',
                pageTitle: 'Pictournal || Profile',
                username: username,
                posts: user.posts,
                following: following,
                user: mainUser,
                profileUser: user,
                canEdit: false
            })
        })
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
                    res.redirect('/profile/' + user._id);
                });
        });
};

exports.getFollowing = (req, res, next) => {
    res.render('user/follow-list', {
        path: '/profile',
        pageTitle: 'Following',
        user: req.user
    })
};


exports.getFeed = (req, res, next) => {
    res.render('user/feed', {
        path: '/feed',
        pageTitle: 'Feed',
        user: req.user
    })
};

exports.newPost = (req, res, next) => {
    res.render('user/newPost', {
        path: '/newPost',
        pageTitle: 'New Post',
        user: req.user
    })
};