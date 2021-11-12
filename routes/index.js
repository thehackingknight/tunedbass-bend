var express = require('express');
var router = express.Router();
const axios = require('axios')
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const fs = require('fs')
const http = require('http')
/* GET home page. */
router.get('/', function(req, res, next) {

  
  res.render('index')
  
});
router.get('/file', async function(req, res, next) {
  
  const token = req.query.url//'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTYzNjc0MDg2MCwianRpIjoiZjJjNjJhOTQtOTM0Zi00NGVlLWIxMGEtOTcyYjc4MmI2NGUzIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJ1cmwiOiJodHRwczovL3Jlcy5jbG91ZGluYXJ5LmNvbS9za2V0Y2hpL3ZpZGVvL3VwbG9hZC92MTYzNjczOTMwMS9UdW5lZEJhc3MvYXVkaW8lMjBmaWxlcy9nZHV3dHl4b2lxY2Z0eDU1cjZzci5tcDMifSwibmJmIjoxNjM2NzQwODYwLCJleHAiOjE2MzY5MTM2NjB9.U-mu4FAGscqwNc1dw_lXE6rIR491GJ7YgjhYvRc2T-k'
  const info = jwt.verify(token, 'CyuJT65KcLcNSOUJVLNCqXztE4XNYkG5')
  const {url} = info.sub  
  http.get(url.replace('https', 'http'), r=>{
    r.pipe(res)
  })


  
});

let sockt;
const getIo = (io) =>{
  //console.log('ioio');
  io.on('connection', (socket) => {
    sockt = socket;
    //console.log(socket.id)
    socket.on('song', (data) => {
      
      socket.broadcast.emit('song', {url: 'http://localhost:8000/sketchi/songs/' + data, title: data.split('.')[0]})
    })

    socket.on('now', data=>{
      console.log(data)
      socket.emit('now', data)
    })

    //Update state of other users
    socket.on("update-song", (song) => {
      console.log("update-song");
      socket.broadcast.emit("update-song", song);
    });


    socket.on('comment', data=>{
      socket.broadcast.emit("comment", data)
    })
    socket.on('like', data=>{
      socket.broadcast.emit("like", data)
    })
    socket.on('notif', data=>{
      socket.broadcast.emit("notif", data)
    })

   })
}

function giveSocket(){return sockt}


module.exports = {router, getIo, giveSocket};
