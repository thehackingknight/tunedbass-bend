const express = require("express");
const router = express.Router();
const fs = require("fs");
const request = require("request");
const uuid = require('uuid'), multer =  require('multer');
const path = require('path');
const SONGS_DIR = path.join(__dirname, 'songs')
const {giveSocket} = require('./index')
router.get("/", (req, res) => {
  res.render("upload");
});

const API_URL = "https://morejust.herokuapp.com/file";

console.log("fuk");

const upl = (fpath) => {
  var r = request.post(
    API_URL,
    function optionalCallback(err, httpResp, fileLink) {
      if (err) {
       console.error("Upload failed:", err);
      }
      else{
              console.log("Upload successful! Link:", fileLink);
              var socket = giveSocket()
              socket.emit('file-url', fileLink)

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


router.post("/", (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
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
module.exports = router;
 