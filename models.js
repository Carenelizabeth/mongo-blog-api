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

postSchema.virtual('fullName')
    .get(function() {return this.author.firstName + ' ' + this.author.lastName;})
    .set(function(v){
        this.author.firstName = v.substr(0, v.indexOf(' '));
        this.author.lastName = v.substr(v.indexOf(' ') + 1);
});

postSchema.methods.serialize = function(){
    return {
        title: this.title,
        content: this.content,
        author: this.fullName,
        created: this.created,
        id: this._id
    }
}

const blogPost = mongoose.model('posts', postSchema);

module.exports = {blogPost};