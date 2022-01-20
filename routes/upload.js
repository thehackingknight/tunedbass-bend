const express = require("express");
const uploadRouter = express.Router();
const fs = require("fs");

const request = require("request");
const uuid = require("uuid"),
  multer = require("multer");
const path = require("path");
const { extname, resolve } = require("path");
const cloudinary = require("../utils/cloudinary");

uploadRouter.get("/", (req, res) => {
  console.log(req.files);
  res.render("upload");
});

const API_URL = "https://morejust.herokuapp.com/file";
let sockt;
const getIoUpload = (io) => {
  io.on("connection", (socket) => {
    sockt = socket;
    socket.on("upload", (song) => {
      //fs.writeFile('song.mp3', song, (err)=>{if (err) console(err)})
      console.log(song.name);
    });
  });
};

const upl = (fpath, res) => {
  let r = request.post(
    API_URL,
    function optionalCallback(err, httpResp, fileLink) {
      if (err) {
        console.error("Upload failed:", err);
      } else {
        console.log("Upload successful! Link:", fileLink);
        sockt.emit("on-url", fileLink);

        console.log("Operation complete.");
        console.log("Heading over to django...");
        //resp.send(fileLink);

        fs.unlink(fpath, (err) => {
          if (err) throw err;
          console.log("File deleted successfully!");
        });

        res.send(fileLink);
      }
    }
  );
  let form = r.form();
  form.append("file", fs.createReadStream(fpath));
};

let filePath;
/*
const storage = multer.diskStorage({
  destination: (req, file, cb)=>{cb(null, './songs/')},
  filename: async (req, file, cb) => {
    let fname  = uuid.v4().toString() + "_" + file.originalname
      cb (null, fname);
      filePath = './songs/' + fname;
  }
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'songs',
    format: async (req, file) => 'mp3', // supports promises as well
    public_id: (req, file) => 'computed-filename-using-request',
  },
});
*/


function tbuuid(){
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!file) return cb(new Error("File not provided"), null);
    return cb(null, resolve(process.cwd(), "songs"));
  },

  filename: (req, file, cb) => {
    let filename = Date.now() + tbuuid() + extname(file.originalname);
    filePath = filename;
    return cb(null, filename);
  },
});
const parser = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


uploadRouter.post("/", parser.single("file"), async (req, res, next) => {

  const {rt, cd_id} = req.query;
  
  let rtype = '', folder = 'TunedBass/';
  if (rt && rt === 'img'){
    rtype = 'image',
    folder += 'images'
  }
  else{
rtype = 'video',
folder += 'audio files'
  }

cloudinary.
  uploader.upload(
    req.file.path,
     {resource_type: rtype, folder: folder, overwrite: true, public_id: cd_id !== 'undefined' ? cd_id : ''}, (err, result)=>{
       if (err) {
         console.log(err)
         res.status(500).json({msg: 'something went wrong'})
         return
        };

        fs.unlink(req.file.path, delErr=>{
          if (delErr) return res.status(500).send(delErr);
          console.log('Temp file deleted successfully')
          res.json({url: result.secure_url, cloudinary_id: result.public_id})

        })
        
     }
      )
    
      //res.send('ok')
});
module.exports = { uploadRouter, getIoUpload };
