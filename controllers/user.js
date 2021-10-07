const User = require("../models/User");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv');
const crypto = require("crypto");


function genId(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
dotenv.config()

const {ACCESS_TOKEN_SECRET} = process.env

const signin = async (req, res, next) => {

    const { email, password } = req.body;
    const tkn = req.headers.authorization? req.headers.authorization.split(" ")[1] : null;
    let decodedData;
    if (tkn) {
        const isCustom = tkn.length < 500

        if (isCustom) {
            decodedData = jwt.verify(tkn, ACCESS_TOKEN_SECRET)
        }
        else {
            decodedData = jwt.decode(tkn)
        }

        const user= await User.findOne({ email: decodedData.email})
        if (user){
            return res.status(200).json({ user })
        }
    }

    else{
        try{
        const existingUser = await User.findOne({ email })
        if (!existingUser) return res.status(404).json({ message:'User Does not exist!'})
        const isPassCorrect = await bcrypt.compare(password, existingUser.password)
        if (!isPassCorrect) return res.status(400).json({ message:'Password incorrect!'})

        const token = jwt.sign({ email, id: existingUser._id}, ACCESS_TOKEN_SECRET, { expiresIn: '1h'})
        res.status(200).json({result: existingUser, token})
    }
    catch (err){
        res.status(500).json({message: 'Something went wrong'})

    } 
    }
   
    

}

const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    try{
        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).json({ message:'User already exist!'})

        const hashedPass = await bcrypt.hash(password, 12)

        const result = await User.create({ email, username, password: hashedPass, iid:genId(7)})
        const token = jwt.sign({ email, id: result._id}, ACCESS_TOKEN_SECRET, { expiresIn: '1h'})
        res.status(200).json({result, token})
    }
    catch (err){
        console.log(err)
        res.status(500).json({message: 'Something went wrong'})

    }
}


module.exports = {signin, signup}