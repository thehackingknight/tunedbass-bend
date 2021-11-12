const express = require("express");
const uploadRouter = express.Router();
const fs = require("fs");
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const request = require("request");
const uuid = require("uuid"),
  multer = require("multer");
const path = require("path");
const SONGS_DIR = path.join(__dirname, "songs");
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



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!file) return cb(new Error("File not provided"), null);
    return cb(null, resolve(process.cwd(), "songs"));
  },

  filename: (req, file, cb) => {
    let filename = Date.now() + extname(file.originalname);
    filePath = filename;
    return cb(null, filename);
  },
});
const parser = multer({ storage });
const upload = multer();

let corsOpions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

uploadRouter.post("/", parser.single("file"), async (req, res, next) => {

//const file = req.files.file
  //let fname  = uuid.v4().toString() + "_" + file.name
  
  let fpath ='songs/' + req.file.filename
  //fs.writeFileSync(fpath, Buffer.from(new Uint8Array(req.file.buffer)) );

  cloudinary.
  uploader.upload(
    req.file.path,
     {resource_type: "video", folder: `TunedBass/audio files/`, overwrite: true}, (err, result)=>{
       if (err) {
         console.log(err)
         res.status(500).json({msg: 'something went wrong'})
         return
        };

        fs.unlink(req.file.path, delErr=>{
          if (delErr) return res.status(500).send(delErr);
          console.log('Temp file deleted successfully')
          res.json({url: result.secure_url})

        })
        
     }
      )
    
      //res.send('ok')
});
module.exports = { uploadRouter, getIoUpload };
