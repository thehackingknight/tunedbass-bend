var express = require('express');
var router = express.Router();
const fs = require('fs');
const md5 = require('md5');
function tbuuid(){
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}

router.post('/chunkupload', (req, res, next) => {
  const { name, currentChunkIndex,totalChunks } = req.query;

  const firstChunk = isNaN(currentChunkIndex);
  const lastChunk = parseInt(currentChunkIndex) === parseInt(totalChunks) - 1;
  const ext = name.split('.').pop();
  
  const data= req.body.toString().split(',')[1];
  const buffer = new Buffer.from(data, 'base64');

  const tempName = 'tmp_' + md5(name) + '.' + ext;

  if (firstChunk && fs.existsSync('./uploads/' + tempName)) {
    console.log('unlinking')
    fs.unlinkSync('./uploads/' + tempName)};
  fs.appendFileSync('./uploads/' + tempName, buffer)
  
  if (lastChunk) {
    const fName = md5(name + req.ip) + '.' + ext;
   // console.log(tempName)
    fs.renameSync('./uploads/' + tempName, './uploads/' + fName);
    res.status(200).json({fName})
  }
  else{
    res.send('ok')
  }
  
})
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
