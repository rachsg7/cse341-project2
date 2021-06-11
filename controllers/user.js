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
}