const express = require('express');

const router = express.Router();
const isAuth = require('../middleware/is-auth');
const userController = require('../controllers/user');

router.get('/newPost', isAuth, userController.newPost);

router.get('/profile', isAuth, userController.getProfile);

router.get('/edit-profile', isAuth, userController.getEditProfile);

router.get('/following', isAuth, userController.getFollowing);

router.get('/feed', isAuth, userController.getFeed);

module.exports = router;