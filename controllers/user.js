exports.getProfile = (req, res, next) => {
    res.render('user/profile', {
        path: '/profile',
        pageTitle: 'Pictournal || Profile'
    });
};

exports.getEditProfile = (req, res, next) => {
    res.render('user/edit-profile', {
        path: '/profile',
        pageTitle: 'Edit Profile'
    })
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