const express = require("express");
const uploadRouter = express.Router();
const fs = require("fs");
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
      fpath = './songs/' + fname;
  }
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
const upload = multer({
  storage,
});

let corsOpions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

uploadRouter.post("/", upload.single("file"), async (req, res, next) => {

  const url = process.env.HOST_URL + '/song/' + filePath
  res.status(200).json({url})
  /*
  if (filePath){
    const result = await cloudinary.uploader.upload(filePath,{
      resource_type: 'raw'
    }, (err, cres)=>{
      if (err) return res.status(500).json({ message: "Some went wrong"})
      console.log(cres)
    })
    res.status(200).json(result)
  }
  else{
    res.send("Multer failed");
  }*/
  //res.send("DONE");
});
module.exports = { uploadRouter, getIoUpload };
