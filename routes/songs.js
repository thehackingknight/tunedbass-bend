const express = require("express");
const router = express.Router();
const songCtrl = require("../controllers/song");
const uuid = require("uuid");
const { extname, resolve } = require("path");
const multer = require("multer");

const Song = require("../models/Song");
const User = require("../models/User");
let filePath;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!file) {
      console.log("No file");
      return cb(new Error("File not provided"), null);
    }
    return cb(null, resolve(process.cwd(), "songs"));
  },

  filename: (req, file, cb) => {
    let filename = uuid.v4().toString() + "_" + file.originalname;
    filePath = filename;
    return cb(null, filename);
  },
});

const upload = multer({
  storage,
});

router.get("/", async (req, res) => {
  Song.find((err, songs) => {
    res.json({ songs });
  });
});

router.post("/update", songCtrl.update);
router.post("/upload", songCtrl.upload);
module.exports = router;
