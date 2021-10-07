const mongoose = require('mongoose')

const SongSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    collabos: {
        type: Array,
        default: []
    },
    
    tags: {
        type: Array,
        default: []
    },
    
    likers: {
        type: Array,
        default: []
    },
    comments: {
        type: Array,
        default: []
    },
    genre: {
        type: String,

    },
    by: {
        type: String,

    },
    uploader: {
        type: Object,

    },
    file: {
        type: String,
    },
    url: {
        type: String,
    },

    image: {
        type: String,
    },

    iid: {
        type: String,
        required: true
    }


})

module.exports = mongoose.model('Song', SongSchema)