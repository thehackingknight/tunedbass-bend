const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },

  iid: {
    type: String,
    required: true,
  },

  songs: {
    type: Array,
    default: []
  },
  playlist: {
    type: Array,
    default: []
},
  followers: {
    type: Array,
    default: []
  },
  following: {
    type: Array,
    default: []
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://res.cloudinary.com/sketchi/image/upload/v1632231917/pngfind.com-placeholder-png-6104451_1_dgszsn.png'
  },
  password: {
    type: String,
    required: true,
  },

  date: {
      type: Date,
      default: Date.now()
  }

},{
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema)