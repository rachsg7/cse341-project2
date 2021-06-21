const mongoose = require('mongoose');
//const { update } = require('../../00-starting-setup/00-starting-setup/models/user');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    profileImgUrl: {
        type: String,
        required: false
    },
    resetToken: String,
    resetTokenExpiration: Date,

    /* !! Because posts have the UserId this probably doesn't need to be here actually 
    userPosts: {
        posts: [{
            postId: {
                type: Schema.Types.ObjectId,
                ref: 'Post',
                required: true
            } // Anything else to link posts and the user?
        }]
    },*/
    following: {
        users: [{
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: false
            }
        }]
    }
});

/** Todo: fill out functions
 *  Need user auth working first I think
 */
userSchema.methods.addPost = function(post) {

};

userSchema.methods.deletePost = function(postId) {

};

/** Todo: fill out functions */
userSchema.methods.addComment = function(post) {

};

userSchema.methods.deleteComment = function(postId) {

};

userSchema.methods.follow = function(user) {
    const userFollows = [...this.following.users];
    userFollows.push({
        userId: user._id
    });
    const updatedFollows = {
        users: userFollows
    };
    this.following = updatedFollows;
    return this.save();
};

userSchema.methods.isFollowing = function(userId) {
    const updatedUsers = this.following.users.filter(user => {
        return user.userId.toString() == userId.toString();
    });
    let isFollowing;
    if (updatedUsers.length >= 1) {
        isFollowing = true;
    } else {
        isFollowing = false;
    }
    return isFollowing;
};

userSchema.methods.unfollow = function(userId) {
    const userFollows = this.following.users.filter(user => {
        return user._id.toString() == userId.toString();
    });
    this.following.users = userFollows;
    return this.save();
};

module.exports = mongoose.model('User', userSchema);