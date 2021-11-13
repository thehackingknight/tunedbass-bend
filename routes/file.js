var express = require("express");
var router = express.Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
const fs = require("fs");
const http = require("http");
const cloudinary = require("../utils/cloudinary");

router.get("/", async function (req, res, next) {
  const token = req.query.url; //'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTYzNjc0MDg2MCwianRpIjoiZjJjNjJhOTQtOTM0Zi00NGVlLWIxMGEtOTcyYjc4MmI2NGUzIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJ1cmwiOiJodHRwczovL3Jlcy5jbG91ZGluYXJ5LmNvbS9za2V0Y2hpL3ZpZGVvL3VwbG9hZC92MTYzNjczOTMwMS9UdW5lZEJhc3MvYXVkaW8lMjBmaWxlcy9nZHV3dHl4b2lxY2Z0eDU1cjZzci5tcDMifSwibmJmIjoxNjM2NzQwODYwLCJleHAiOjE2MzY5MTM2NjB9.U-mu4FAGscqwNc1dw_lXE6rIR491GJ7YgjhYvRc2T-k'
  const info = jwt.verify(token, "CyuJT65KcLcNSOUJVLNCqXztE4XNYkG5");
  const { url } = info.sub;
  const file = fs.createWriteStream("songs/aud.mp3");
  http.get(url.replace("https", "http"), (r) => {
    const cont = fs.readFileSync("songs/aud.mp3");
    let t = "";
    r.on("data", (data) => {
      res.write(data);
    }).on("end", () => {
      res.end();
    });
  });
});

router.get("/download", async function (req, res, next) {
  const token = req.query.url; //'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTYzNjc0MDg2MCwianRpIjoiZjJjNjJhOTQtOTM0Zi00NGVlLWIxMGEtOTcyYjc4MmI2NGUzIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJ1cmwiOiJodHRwczovL3Jlcy5jbG91ZGluYXJ5LmNvbS9za2V0Y2hpL3ZpZGVvL3VwbG9hZC92MTYzNjczOTMwMS9UdW5lZEJhc3MvYXVkaW8lMjBmaWxlcy9nZHV3dHl4b2lxY2Z0eDU1cjZzci5tcDMifSwibmJmIjoxNjM2NzQwODYwLCJleHAiOjE2MzY5MTM2NjB9.U-mu4FAGscqwNc1dw_lXE6rIR491GJ7YgjhYvRc2T-k'
  const info = jwt.verify(token, "CyuJT65KcLcNSOUJVLNCqXztE4XNYkG5");
  const { url } = info.sub;
  const file = fs.createWriteStream("songs/aud.mp3");
  http.get(url.replace("https", "http"), (r) => {
    const cont = fs.readFileSync("songs/aud.mp3");
    let t = "";
    r.pipe(res);
  });
});

router.post("/delete", async function (req, res, next) {
  const {id} = req.query
  cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    cloudinary.uploader.destroy(id, {type: 'upload', resource_type: 'video', invalidate: true}, (err, r) => {
      if (err) {
        console.log(err)
        return res.status(500).send("Something went wrong");}
      console.log(r);
      res.send("File deleted successfully");
    });
});

module.exports = router;
