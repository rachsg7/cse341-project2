exports.getIndex = (req, res, next) => {
    res.render('index', {
        path: '/',
        pageTitle: 'Welcome to Pictournal'
    });
};