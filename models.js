'use strict';

const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: String,
    author: {
        firstName: String,
        lastName: String
    },
    content: String,
    date: {type: Date, default: Date.now}
})

const Post = mongoose.model('Post', postSchema);