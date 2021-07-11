const express = require("express");
const router = express.Router();
const fs = require("fs");
const request = require("request");
router.get("/", (req, res) => {
  res.render("upload");
});

const API_URL = "https://morejust.herokuapp.com/file";

console.log("fuk");

const upl = (song, resp) => {
  var r = request.post(
    API_URL,
    function optionalCallback(err, httpResp, fileLink) {
      if (err) {
        return console.error("Upload failed:", err);
      }
      console.log("Upload successful! Link:", fileLink);

      console.log("Operation complete.");
      resp.send("hold...");

      fs.unlink(song.name, (err) => {
        if (err) throw err;
        console.log("File deleted successfully!");
      });
    }
  );
  var form = r.form();
  form.append("file", fs.createReadStream(song.name));
};

router.post("/", (req, res) => {
  var song = req.files.file;
  fs.writeFile(song.name, song.data, function (err, result) {
    if (err) {
      throw err;
    } else {
      console.log("Success baba");
      upl(song, res);
    }
  });
});
module.exports = router;
