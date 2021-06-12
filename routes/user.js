const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

router.get('/profile', userController.getProfile);

router.get('/edit-profile', userController.getEditProfile);

router.get('/following', userController.getFollowing);

router.get('/feed', userController.getFeed);

module.exports = router;