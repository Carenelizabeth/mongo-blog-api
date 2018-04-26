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
            blogpost: blogpost
        }))
        .catch(
            err =>{
                console.error(err);
                res.status(500).json({message: 'Internal server error'});
    });
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