const Song = require('../models/Song')
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
  
const upload = async (req, res) =>{
    try{
        
const song = new Song(req.body)
song.iid = genId(7)
    song.save()
    return res.status(200).json({song})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({mesasage: 'Something went wrong'})
    }
    
}
const update = (req, res) =>{
    console.log(req.body)
    return res.status(200).json({data: 'Good'})
}



module.exports = {update, upload}