const express = require('express')
const router = express.Router();
const fs = require('fs');
const path = require('path');
const axios = require('axios').default;
const fetch = require('node-fetch')
const ytdl = require('ytdl-core');

const SONGS_DIR = path.join(__dirname, 'songs')
const print = (str) =>{
    console.log(str)
}
router.post('/', async (req, res)=>{
    var url = "https://r1---sn-xjiv15-j2ue.googlevideo.com/videoplayback?expire=1626372856&ei=mCbwYPPjKvOFvdIP0PeM-AQ&ip=41.198.132.50&id=o-AKcGkXHGVPLAfcMwUqDlNOMQwXI_gjDluFbyeAw_asZE&itag=18&source=youtube&requiressl=yes&mh=sB&mm=31%2C29&mn=sn-xjiv15-j2ue%2Csn-woc7ln7y&ms=au%2Crdu&mv=m&mvi=1&pl=18&initcwndbps=456250&vprv=1&mime=video%2Fmp4&ns=16mPKOIP2QDchuvWPaY1IroG&gir=yes&clen=7302064&ratebypass=yes&dur=165.883&lmt=1616943118303492&mt=1626350933&fvip=5&fexp=24001373%2C24007246&beids=9466587&c=TVHTML5&txp=6210222&n=5tvT4SQFzTdgHDVjrF&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRAIgHMUI5g9KUgT507EyekFIPG3pjT4FX9_D2faIBz0unVkCIH1bIG_7kLdrexm5PIt9HLCfDfx4jCchuHQVGaV1mEF9&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRgIhAPLJg5WpbxwiJsT0Gt3LUavcCl5dFh1r_9Nfp1PcVyFYAiEAlnww9kyIKoaVaxWrYwSGu7_0nkxYLvU5qtLjIseqiCg%3D"
var URL = "https://www.youtube.com/watch?v=52ZuuPUwecw&ab_channel=SquashBeatsSquashBeats"
    //axios.get(uri).then(res =>{console.log(res.data)})
    //.catch(err => console.log(err))
    //res.send('File(file)')
    
    //let r = await axios.get(url)
    //let r = await axios.get(url)
    //let blb = await r.data
    var txt = ''
    /*const response = await fetch(url);
    const buffer = await response.buffer();
     */
     //fs.writeFile(`name.mp4`, buffer, (err, res) => {
     //    if(err){
     //       print(err)
     //    }
     //    else{
     //        console.log('finished downloading video!')
     //    }
     //}
     //  );      
    
    //fs.writeFileSync('vid.mp4', blb.encode('utf8'))
   //var file = new VFile({path: '~/example.txt', value: 'Alpha *braavo* charlie.'})

   let info = await ytdl.getInfo(URL)
   let videoFormats = ytdl.filterFormats(info.formats, 'videoonly');
   //res.send({'url': videoFormats[2].url})
    res.header('Content-Disposition', 'attachment; filename="video.mp4')
    res.header('Content-Length', 52428800)
    ytdl(URL, { 
       format: 'mp4'
    }).pipe(res)
})
var fmts;
var uri;
router.get('/', async function (req, res){
    
    let {url, itag, itag001} = req.query;
    if (url){
        uri = url;
        let info = await ytdl.getInfo(url)
    let {formats, videoDetails} = info

    formats=formats.filter(format => format.qualityLabel != null)
    fmts = formats
    var {title, lengthSeconds, thumbnails} = videoDetails
        console.log(formats);
    //console.log(formats[0].contentLength)
    res.json({ formats, thumbnail: thumbnails[0], title, lengthSeconds  })
    }

    else if (itag){
        let info = await ytdl.getInfo(uri)
    let {formats, videoDetails} = info

        formats=formats.filter(format => format.qualityLabel != null)
        var frmt = formats.filter(format => format.itag == itag)[0]
        console.log('frmt: ' + frmt.contentLength);
        res.header('Content-Disposition', `attachment; filename=${videoDetails.title}.mp4`)
        res.header('Content-Length', frmt.contentLength)
        ytdl(uri, { filter: format => format.itag == itag }).pipe(res)
    }else if (itag001){
        var frmt = fmts.filter(format => format.itag == itag001)[0]
        console.log('frmt');
        res.json({url: frmt.url})
    }
    else{
        res.render('download')
}
    
    
})

  

module.exports = router