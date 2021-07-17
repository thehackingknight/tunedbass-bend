const express = require('express')
const router = express.Router();
const fs = require('fs');
const path = require('path');
const SONGS_DIR = path.join(__dirname, 'songs')
const print = (str) =>{
    console.log(str)
}
router.get('/:songId', function (req, res){
    const { songId } = req.params

    var file = SONGS_DIR + '/' + songId + '.mp3'
    
    res.sendFile(file)
})

module.exports = router