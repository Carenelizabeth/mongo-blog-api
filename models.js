'use strict';

const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: String,
    author: {
        firstName: String,
        lastName: String
    },
    content: String,
    created: {type: Date, default: Date.now}
})

postSchema.methods.serialize = function(){
    return {
        id: this.id,
        title: this.title
    }
}

const blogPost = mongoose.model('posts', postSchema);

module.exports = {blogPost};