const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
    }],
    description: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        required: true
    },
    privacy: {
        type: String,
        required: true
    },


    /** make sure these line up with comment model */
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

module.exports = mongoose.model('Post', postSchema);