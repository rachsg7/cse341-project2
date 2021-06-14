const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        required: true
    },


    /** can a user comment on a comment*/
    postComments: {
        Comments: [{
            postId: {
                type: Schema.Types.ObjectId,
                ref: 'Comment',
                required: true
            }
        }]
    }
});

/** Todo: fill out functions */
userSchema.methods.addComment = function(post) {

};

userSchema.methods.deleteComment = function(postId) {

};

module.exports = mongoose.model('Comment', commentSchema);