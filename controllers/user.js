const { validationResult } = require('express-validator');
const User = require('../models/user');
const Post = require('../models/post');
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
    const isFollowing = req.user.isFollowing(visiting);

    User.findById(visiting)
        .then(user => {
            const mainUser = req.user;
            const username = user.name;
            const id = mainUser._id;
            const following = user.following.users.length;
            //find post for user
            Post.find({userId: visiting}).then(posts => {
                // If the user is the owner of the Profile, they are allowed to edit
                if (mainUser._id.toString() == visiting.toString()) {
                    return res.render('user/profile', {
                        path: '/profile',
                        pageTitle: 'Pictournal || Profile',
                        username: username,
                        posts: posts,
                        following: following,
                        user: user,
                        profileUser: user,
                        canEdit: true,
                        isFollowing: isFollowing
                    });
                }
                // If the user does not own the profile, they cannot edit
                return res.render('user/profile', {
                    path: '/profile',
                    pageTitle: 'Pictournal || Profile',
                    username: username,
                    posts: posts,
                    following: following,
                    user: mainUser,
                    profileUser: user,
                    canEdit: false,
                    isFollowing: isFollowing
                })
            });
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

exports.postFollow = (req, res, next) => {
    const userId = req.body.userId;
    User.findById(userId)
        .then(userToFollow => {
            return req.user.follow(userToFollow);
        })
        .then(result => {
            res.redirect('/profile/' + userId);
        })
};

exports.postUnfollow = (req, res, next) => {
    const userId = req.body.userId;
    User.findById(userId)
        .then(userToUnfollow => {
            return req.user.unfollow(userToUnfollow);
        })
        .then(result => {
            res.redirect('/profile/' + userId);
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

exports.postNewPost = (req, res, next) => {
    const tags = (req.body.tags).split("#");
    const description = req.body.post_desc;
    const privacy = req.body.privacy;
    const time = new Date();
    const userId = req.user._id
    const image = req.file;

    const post = new Post({
        userId: userId,
        time: time,
        image: image.path,
        tags: tags,
        description: description,
        privacy, privacy
    });
    post.save()
    .then(result => {
        res.redirect('/feed');
    })
    .catch(err => {
        console.log(err);
    });

};

exports.postDetails = (req, res, next) => {
    const id = req.params.postId;
    Post.findById(id).then(post => {
        User.findById(post.userId).then(author => {
            res.render('user/postDetails', {
                path: '/postDetails',
                pageTitle: 'Post Details',
                user: req.user,
                author: author,
                post: post
            })
        });
    });
};