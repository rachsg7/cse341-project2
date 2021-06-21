const express = require('express');
const { body } = require('express-validator/check');

const router = express.Router();
const isAuth = require('../middleware/is-auth');
const userController = require('../controllers/user');

router.get('/newPost', isAuth, userController.newPost);

router.get('/profile', isAuth, userController.getProfile);

router.get('/profile/:userId', isAuth, userController.getProfile);

router.get('/edit-profile', isAuth, [
    body('user_name')
    .isString()
    .isLength({ min: 3 })
    .trim(),
    body('user_bio')
    .isLength({ min: 5, max: 400 })
    .trim()
], userController.getEditProfile);

router.post('/edit-profile', isAuth, userController.postEditProfile);

router.get('/following', isAuth, userController.getFollowing);

router.post('/follow', isAuth, userController.postFollow);

router.post('/unfollow', isAuth, userController.postUnfollow);

router.get('/feed', isAuth, userController.getFeed);

module.exports = router;