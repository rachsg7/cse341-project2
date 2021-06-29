const { validationResult } = require('express-validator');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const fetch = require('node-fetch');
const fileHelper = require('../util/file');
const user = require('../models/user');

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

    // console.log(req.user.following);

    User.findById(visiting)
        .then(user => {
            const mainUser = req.user;
            const username = user.name;
            const id = mainUser._id;
            const following = user.following.users.length;
            //find post for user
            Post.find({ userId: visiting }).then(posts => {
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
        .catch(err => {
            res.redirect('/404');
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
    const userFollows = req.params.userId;

    User.findById(userFollows)
        .then(user => {
            user
                .populate('following.users.userId')
                .execPopulate()
                .then(user => {
                    const following = user.following.users;
                    res.render('user/follow-list', {
                        path: '/profile',
                        pageTitle: 'Following',
                        user: req.user,
                        following: following,
                        profileUser: user
                    })
                })
                .catch(err => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
        privacy,
        privacy
    });
    post.save()
        .then(result => {
            res.redirect('/feed');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })

};

exports.postDetails = (req, res, next) => {
    const id = req.params.postId;
    let comments = [];
    let likes = 0;
    let liked = false;

    Comment.find({postId: id})
    .then(postComments => {
        for(let i = 0; i < postComments.length; i++){
            if(postComments[i].isLike){
                likes += 1;
                if(postComments[i].userId = req.user._id){
                    liked = true;
                }
            }else{
                comments.push(postComments[i])
            }
        }
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })

    Post.findById(id).then(post => {
        User.findById(post.userId).then(author => {
            res.render('user/postDetails', {
                path: '/postDetails',
                pageTitle: 'Post Details',
                user: req.user,
                author: author,
                post: post,
                comments: comments,
                likes: likes,
                userLiked: liked
            })
        });
    });
};

exports.newComment = (req, res, next) => {
    const id = req.params.postId;
    let comments = [];
    let likes = 0;
    let liked = false;

    Comment.find({postId: id})
    .then(postComments => {
        for(let i = 0; i < postComments.length; i++){
            if(postComments[i].isLike){
                likes += 1;
                if(postComments[i].userId = req.user._id){
                    liked = true;
                }
            }else{
                comments.push(postComments[i])
            }
        }
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })

    Post.findById(id).then(post => {
        User.findById(post.userId).then(author => {
            res.render('user/newComment', {
                path: '/newCOmment',
                pageTitle: 'New Comment',
                user: req.user,
                author: author,
                post: post,
                comments: comments,
                likes: likes,
                userLiked: liked
            })
        });
    });
};

// RANDOM USER CONTENT

exports.randomUser = (req, res, next) => {
    let settings = { method: "Get" };
    var object = [];
    fetch('https://api.namefake.com/', settings)
        .then(res => res.json())
        .then((json) => {
            object = JSON.parse(JSON.stringify(json));
            console.log(object.name);
            return object;
        })
        .catch((err) => {
            console.log(err);
        });
}

exports.randomEmail = (req, res, next) => {
    return req.email_u + "@" + email_u;
}

exports.randomBio = (req, res, next) => {
    var bio = "Hi, my name is " + req.name + " and I love to play " + req.sport;
    return bio;
}

exports.randomProfileImage = (req, res, next) => {
    const fs = require('fs')
    const request = require('request')

    const download = (url, path, callback) => {
        request.head(url, (err, res, body) => {
            request(url)
                .pipe(fs.createWriteStream(path))
                .on('close', callback)
        })
    }

    const url = 'https://thispersondoesnotexist.com/image'
    const path = './images/' + Date.now() + '.jpg'

    return path;
}

exports.likePost = (req, res, next) => {
    const postId = req.params.postId;
    const user = req.user._id;
    const comment = new Comment({
        userId: user,
        postId: postId,
        isLike: true,
        time: new Date()
    });
    comment.save()
    .then(result => {
        res.redirect(`/postDetails/${postId}`);
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postComment = (req, res, next) => {
    const postId = req.body.postId
    const desc = req.body.description;
    const user = req.user._id;
    const name = req.user.name;
    const comment = new Comment({
        userId: user,
        username: name,
        postId: postId,
        isLike: false,
        description: desc,
        time: new Date()
    });
    comment.save()
        .then(result => {
            res.redirect(`/postDetails/${postId}`);
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};