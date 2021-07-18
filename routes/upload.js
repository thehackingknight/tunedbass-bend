const express = require("express");
const uploadRouter = express.Router();
const fs = require("fs");
const request = require("request");
const uuid = require('uuid'), multer =  require('multer');
const path = require('path');
const SONGS_DIR = path.join(__dirname, 'songs')
const {giveSocket} = require('./index')
const cors = require('cors')
uploadRouter.get("/", (req, res) => {
  console.log(req.files);
  res.render("upload");
}); 

const API_URL = "https://morejust.herokuapp.com/file";
var sockt;
const getIoUpload = (io) => {
  io.on('connection', socket =>{
    sockt = socket;
    console.log('upload socket');
    socket.on('upload', song => { 
      //fs.writeFile('song.mp3', song, (err)=>{if (err) console(err)})
      console.log(song.name);
    })

  })
}

const upl = (fpath) => {
  var r = request.post(
    API_URL,
    function optionalCallback(err, httpResp, fileLink) {
      if (err) {
       console.error("Upload failed:", err);
      }
      else{
              console.log("Upload successful! Link:", fileLink);
              sockt.emit('on-url', fileLink)

      }

      console.log("Operation complete.");
      console.log("Heading over to django...");
      //resp.send(fileLink); 

     fs.unlink(fpath, (err) => {
        if (err) throw err;
        console.log("File deleted successfully!");
      });
    }
  );
  var form = r.form();
  form.append("file", fs.createReadStream(fpath));
};
var fpath = ''
const storage = multer.diskStorage({
  destination: (req, file, cb)=>{cb(null, './songs/')},
  filename: async (req, file, cb) => {
    var fname  = uuid.v4().toString() + "_" + file.originalname
    
      cb (null, fname);
      fpath = './songs/' + fname;
  }
});

const upload = multer({
  storage
}).single('file');

var corsOpions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}
uploadRouter.post("/" , (req, res, next) => {
  upload(req, res, err=>{
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
    } else if (err) {
      // An unknown error occurred when uploading.
    }
    else {
      //All is good.
      console.log(fpath)
      upl(fpath) 
    }
  })
  res.send('respond')

});
module.exports = { uploadRouter, getIoUpload }
 