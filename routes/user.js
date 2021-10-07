const express = require("express");
const router = express.Router();
const User = require('../models/User')

router.get('/:iid', (req, res) =>{
  const { iid } = req.params;
 User.findOne({iid} , (err, user) => { 
   if (err) throw new Error({message: 'Oh boy'})
   res.json({user})
 })
  
})
module.exports = router;
