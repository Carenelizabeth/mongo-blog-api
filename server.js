'use strict'

const bodyParser = require('body-parser')
const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {blogPost} = require('./models');

let server;

const app = express();
app.use(bodyParser.json());

app.get('/blogpost', (req, res) =>{
    blogPost
        .find()
        .then(blogpost => res.json({
            blogpost: blogpost.map(
                (bpost) => bpost.serialize())
        }))
        .catch(
            err =>{
                console.error(err);
                res.status(500).json({message: 'Internal server error'});
    });
});

app.get('/blogpost/:id', (req, res) =>{
    blogPost
        .findById(req.params.id)
        .then(blogpost =>res.json(blogpost.serialize()))
        .catch(err =>{
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
    });
});

app.post('/blogpost', (req,res) =>{
    const requiredFields = ['title', 'content', 'author'];
    for (let i=0; i<requiredFields; i++){
        const field = requiredFields[i];
        if(!(field in req.body)){
            const message = `Missing ${field} in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    blogPost
        .create({
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
            created: req.body.created
        })
        .then(bpost => res.status(201).json(bpost.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'internal server error'});
    });
    
});

app.put('/blogpost/:id', (req,res) =>{
    if(!(req.body.id && req.params.id === req.body.id)){
        const message = `Request path id ${req.params.id} and request body id ${req.body.id} must match`;
        console.error(message);
        return res.status(400).json({message: message});

    }
    const toUpdate = {};
    const updateableFields = ['title', 'author', 'content']
    updateableFields.forEach(field => {
        if (field in req.body){
            toUpdate[field] = req.body[field];
        }
    });
    blogPost
        .findByIdAndUpdate(req.params.id, {$set: toUpdate})
        .then(restaurant => res.status(204).end())
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

app.delete('/blogpost/:id', (req, res) => {
    blogPost
        .findByIdAndRemove(req.params.id)
        .then(() => res.status(204).end())
        .catch(err => res.status(500).json({message: 'internal server error'}));
});

function runServer(databaseUrl, port=PORT){
    return new Promise((resolve, reject) =>{
        mongoose.connect(databaseUrl, err =>{
            if(err){
                return reject(err);
            }
            server = app.listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve();
            })    
            .on('error', err =>{
                mongoos.disconnect();
                reject(err);
            });
        });
    });
}

function closeServer(){
    return mongoose.disconnect().then(() =>{
        return new Promise((resolve, reject) =>{
            console.log('Closing server');
            server.close(err =>{
                if (err){
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module){
    runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};