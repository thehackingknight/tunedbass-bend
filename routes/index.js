var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  
  res.render('index')
  
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
