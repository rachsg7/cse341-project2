const mongoose = require('mongoose');

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
    resetToken: String,
    resetTokenExpiration: Date,

    /** Todo: make sure these line up with post model */
    userPosts: {
        posts: [{
            postId: {
                type: Schema.Types.ObjectId,
                ref: 'Post',
                required: true
            } // Anything else to link posts and the user?
        }]
    },
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

userSchema.methods.follow = function(userId) {

};

userSchema.methods.unfollow = function(userId) {

};

module.exports = mongoose.model('User', userSchema);