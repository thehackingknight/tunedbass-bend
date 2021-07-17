let song;

const addSong = (e) =>{
    song = document.querySelector('#song').files[0]
    const formData = new FormData()
    formData.append('song', song)
    axios.post('http://localhost:8000/songs/', formData)
    .then(res => {
        console.log(res)
        reqSong()
    })
    .catch(err => {
        console.log(err)
    })
}

const getSong = (e) =>{

    const formData = new FormData();
    formData.append('song', 'north3.3')
    axios.get('http://localhost:8000/songs/?q=north3.3',formData)
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
}

$('#add').click(e=>{
    addSong()
})
$('#gsngs').click(e=>{
    getSong()
})


//SOCKET STUFF
const socket = io('/')
    socket.on('connection', ()=>{
      console.log('U are connected')
    })

    const sendMessage = () =>{
      socket.emit('message', document.querySelector('input').value)
    }
    socket.on('message', (data) =>{
      document.querySelector('#message').innerText = data
    })

    
const reqSong = () =>{

    socket.emit('song', song.name)
}
    socket.on('song', (data) =>{
        var div = document.createElement('div')
        div.innerHTML = `
        <div><h5>${data.title}</h5></div>
        <audio controls src=${data.url}> </audio>
        `
        document.querySelector('.songs-container').appendChild(div)
      })
    


$('#gen-form').submit(e=>{
    var { url } = e.target;
    e.preventDefault()
    $.ajax({
        url: '/download',
        contentType: 'application/json',
        data: {url: url.value},
        method: 'get',
        success: (res)=>{
            $('.par001').css('display', 'none')
            var data = res
let html = `
<div class="mb-3">
    <div class="d-fle">
        <div class="thumb-cont">
            <img src=${data.thumbnail.url}>
        </div>
        <div class="info mt-3">
            <h5>${data.title}</h5>
            <div class="mt-2">
                <p><b>Length: </b>${formatTime(data.lengthSeconds)}</p>
            </div>
        </div>
   </div>
   </div>


<label form="formats">Select format</label>
<div class="mt-2"> <select class="w-250 form-select" id="formats"><option selected disabled>Formats</option>`
data.formats.forEach(format =>{
    html += `<option value=${format.itag}>${format.qualityLabel}</option>`
})
html += `</select><div class="mt-3"><button disabled id="dld-btn" class="btn btn-sm btn-success">Download</button></div></div>`

$('.par001').html(html);
$('.par001').fadeIn();
selectReady()
        },
        error: (err)=>{console.log(err)}
    })
})

function selectReady(){
    var dldBtn = $('#dld-btn');
var dldBtn001 = $('#dld-btn001');
var itag;

$('#formats').change((e)=>{

    itag = e.target.value
    console.log(e.target.value);
    if(itag)
        dldBtn.attr('disabled',false)
        dldBtn001.attr('disabled',false)
})

dldBtn.click(e =>{
    e.target.innerText = "Loading..."
    $.ajax({
        url: '/download',
        method: 'get',
        contentType: 'application/json',
        data: {itag},
        success: function(res){
            e.target.innerText = "Download"
        },
        error: function(err){console.log(err)}
    })
})

}
/*
dldBtn001.click(e =>{
    $.ajax({
        url: '/download',
        method: 'get',
        contentType: 'application/json',
        data: {itag001: itag},
        success: function(res){
            
            var a = document.createElement('a');
        e.target.parentElement.innerHTML = `<a class="btn btn-sm btn-success" href="${res.url} target="_blank" download="video.mp4">Download Vid</a>`
        },
        error: function(err){console.log(err)}
    })
})
*/
const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${returnMinutes}:${returnSeconds}`;
  };
var data = {
    "formats": [
        {
            "mimeType": "video/webm; codecs=\"vp9\"",
            "qualityLabel": "1080p",
            "bitrate": 2646000,
            "audioBitrate": null,
            "itag": 248,
            "url": "https://manifest.googlevideo.com/api/manifest/dash/expire/1626562243/ei/YwrzYN61J93ZxgLV2ZzwBg/ip/41.198.132.50/id/5f581547b6f1030e/source/youtube/requiressl/yes/playback_host/r1---sn-xjiv15-j2ue.googlevideo.com/mh/aE/mm/31%2C29/mn/sn-xjiv15-j2ue%2Csn-woc7ln7r/ms/au%2Crdu/mv/m/mvi/1/pl/18/tx/24027395/txs/24027395%2C24027396%2C24027397%2C24027398%2C24027399%2C24027400/hfr/all/as/fmp4_audio_clear%2Cwebm_audio_clear%2Cwebm2_audio_clear%2Cfmp4_sd_hd_clear%2Cwebm2_sd_hd_clear/initcwndbps/485000/vprv/1/mt/1626540309/fvip/1/keepalive/yes/fexp/24001373%2C24007246/itag/0/sparams/expire%2Cei%2Cip%2Cid%2Csource%2Crequiressl%2Ctx%2Ctxs%2Chfr%2Cas%2Cvprv%2Citag/sig/AOq0QJ8wRAIgXd_niv3cAwGIYN5Yb-6E_cLrbspRz3zscv4tXcSXtOoCIDUPdalXzOLkV6vjUp3EhY1pwiE0hXIUIFm90DlaKD_z/lsparams/playback_host%2Cmh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps/lsig/AG3C_xAwRQIgAyP-Dgdc8xS5OVIpcRh73XqtFtjStXu5FzEk3jQyxYoCIQDCDRVIXKMO8twtekZgC807TskZhzpLl6GZ_nMKYVM_1g%3D%3D",
            "width": 1920,
            "height": 1080,
            "fps": 30,
            "hasVideo": true,
            "hasAudio": false,
            "container": "webm",
            "codecs": "vp9",
            "videoCodec": "vp9",
            "audioCodec": null,
            "isLive": false,
            "isHLS": false,
            "isDashMPD": true
        },
        {
            "mimeType": "video/mp4; codecs=\"avc1.42001E, mp4a.40.2\"",
            "qualityLabel": "360p",
            "bitrate": 336487,
            "audioBitrate": 96,
            "itag": 18,
            "url": "https://r1---sn-xjiv15-j2ue.googlevideo.com/videoplayback?expire=1626562243&ei=YwrzYN61J93ZxgLV2ZzwBg&ip=41.198.132.50&id=o-AJf9IjLfqaJkDiIKgJr2niPhRYoPqJUVzwbuT4arAm4-&itag=18&source=youtube&requiressl=yes&mh=aE&mm=31%2C29&mn=sn-xjiv15-j2ue%2Csn-woc7ln7r&ms=au%2Crdu&mv=m&mvi=1&pl=18&initcwndbps=485000&vprv=1&mime=video%2Fmp4&ns=HxKGlDPCMEutowgOXiu9t0AG&gir=yes&clen=9906744&ratebypass=yes&dur=235.636&lmt=1621860839735096&mt=1626540309&fvip=1&fexp=24001373%2C24007246&c=WEB&txp=6210222&n=C0wecA2c_xwhv0i9&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRAIgM_ROLd07Pl7masTvTxpLHm3K_wNQ3Tp3VfxP9qPJAtoCIA1EShkNhLOPdcEQpWBu3KuZTgNhBRuPinn54NvE1e3g&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIhAM-m2QGByaG8vA10re8yaYtdD9wrxNayhWJP1LBIxjdnAiBwZlBt6bsEzj8WP234-CCU8vqt5B4xoXqFy8fvA8iCZQ%3D%3D",
            "width": 640,
            "height": 360,
            "lastModified": "1621860839735096",
            "contentLength": "9906744",
            "quality": "medium",
            "fps": 30,
            "projectionType": "RECTANGULAR",
            "averageBitrate": 336340,
            "audioQuality": "AUDIO_QUALITY_LOW",
            "approxDurationMs": "235636",
            "audioSampleRate": "44100",
            "audioChannels": 2,
            "hasVideo": true,
            "hasAudio": true,
            "container": "mp4",
            "codecs": "avc1.42001E, mp4a.40.2",
            "videoCodec": "avc1.42001E",
            "audioCodec": "mp4a.40.2",
            "isLive": false,
            "isHLS": false,
            "isDashMPD": false
        },
        {
            "mimeType": "video/mp4; codecs=\"avc1.640028\"",
            "qualityLabel": "1080p",
            "bitrate": 3418421,
            "audioBitrate": null,
            "itag": 137,
            "url": "https://r1---sn-xjiv15-j2ue.googlevideo.com/videoplayback?expire=1626562243&ei=YwrzYN61J93ZxgLV2ZzwBg&ip=41.198.132.50&id=o-AJf9IjLfqaJkDiIKgJr2niPhRYoPqJUVzwbuT4arAm4-&itag=137&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&source=youtube&requiressl=yes&mh=aE&mm=31%2C29&mn=sn-xjiv15-j2ue%2Csn-woc7ln7r&ms=au%2Crdu&mv=m&mvi=1&pl=18&initcwndbps=485000&vprv=1&mime=video%2Fmp4&ns=5OsqyMwBgujBx0dCWf7xfroG&gir=yes&clen=52647492&otfp=1&dur=235.533&lmt=1621860883837306&mt=1626540309&fvip=1&keepalive=yes&fexp=24001373%2C24007246&c=WEB&txp=6216222&n=V0h8AsLjJ28hUHOp&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cotfp%2Cdur%2Clmt&sig=AOq0QJ8wRgIhAM8epGs97pyEgrFa7f6VeIa0JLWd44R7tidvvcsK2yY8AiEAz4JgriTKrdmJj-C4eP8wj1hFscBxGTyT1y9WI4hm5KQ%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIhAM-m2QGByaG8vA10re8yaYtdD9wrxNayhWJP1LBIxjdnAiBwZlBt6bsEzj8WP234-CCU8vqt5B4xoXqFy8fvA8iCZQ%3D%3D&ratebypass=yes",
            "width": 1920,
            "height": 1080,
            "initRange": {
                "start": "0",
                "end": "741"
            },
            "indexRange": {
                "start": "742",
                "end": "1301"
            },
            "lastModified": "1621860883837306",
            "contentLength": "52647492",
            "quality": "hd1080",
            "fps": 30,
            "projectionType": "RECTANGULAR",
            "averageBitrate": 1788199,
            "approxDurationMs": "235533",
            "hasVideo": true,
            "hasAudio": false,
            "container": "mp4",
            "codecs": "avc1.640028",
            "videoCodec": "avc1.640028",
            "audioCodec": null,
            "isLive": false,
            "isHLS": false,
            "isDashMPD": false
        },
        {
            "mimeType": "video/mp4; codecs=\"avc1.4d401e\"",
            "qualityLabel": "360p",
            "bitrate": 555018,
            "audioBitrate": null,
            "itag": 134,
            "url": "https://r1---sn-xjiv15-j2ue.googlevideo.com/videoplayback?expire=1626562243&ei=YwrzYN61J93ZxgLV2ZzwBg&ip=41.198.132.50&id=o-AJf9IjLfqaJkDiIKgJr2niPhRYoPqJUVzwbuT4arAm4-&itag=134&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&source=youtube&requiressl=yes&mh=aE&mm=31%2C29&mn=sn-xjiv15-j2ue%2Csn-woc7ln7r&ms=au%2Crdu&mv=m&mvi=1&pl=18&initcwndbps=485000&vprv=1&mime=video%2Fmp4&ns=5OsqyMwBgujBx0dCWf7xfroG&gir=yes&clen=7438922&otfp=1&dur=235.533&lmt=1621860883831394&mt=1626540309&fvip=1&keepalive=yes&fexp=24001373%2C24007246&c=WEB&txp=6216222&n=V0h8AsLjJ28hUHOp&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cotfp%2Cdur%2Clmt&sig=AOq0QJ8wRgIhALUvLij0uCXXxVE8Rh6kzuza-kGjlnmbZV5t7aIQXXjJAiEAxI_tSoNFOhNAMkovu61BQO2S7-DNLCtbHX1ibD0ihtQ%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIhAM-m2QGByaG8vA10re8yaYtdD9wrxNayhWJP1LBIxjdnAiBwZlBt6bsEzj8WP234-CCU8vqt5B4xoXqFy8fvA8iCZQ%3D%3D&ratebypass=yes",
            "width": 640,
            "height": 360,
            "initRange": {
                "start": "0",
                "end": "740"
            },
            "indexRange": {
                "start": "741",
                "end": "1300"
            },
            "lastModified": "1621860883831394",
            "contentLength": "7438922",
            "quality": "medium",
            "fps": 30,
            "projectionType": "RECTANGULAR",
            "averageBitrate": 252666,
            "highReplication": true,
            "approxDurationMs": "235533",
            "hasVideo": true,
            "hasAudio": false,
            "container": "mp4",
            "codecs": "avc1.4d401e",
            "videoCodec": "avc1.4d401e",
            "audioCodec": null,
            "isLive": false,
            "isHLS": false,
            "isDashMPD": false
        },
        {
            "mimeType": "video/mp4; codecs=\"avc1.64001F, mp4a.40.2\"",
            "qualityLabel": "720p",
            "bitrate": 1070674,
            "audioBitrate": 192,
            "itag": 22,
            "url": "https://r1---sn-xjiv15-j2ue.googlevideo.com/videoplayback?expire=1626562243&ei=YwrzYN61J93ZxgLV2ZzwBg&ip=41.198.132.50&id=o-AJf9IjLfqaJkDiIKgJr2niPhRYoPqJUVzwbuT4arAm4-&itag=22&source=youtube&requiressl=yes&mh=aE&mm=31%2C29&mn=sn-xjiv15-j2ue%2Csn-woc7ln7r&ms=au%2Crdu&mv=m&mvi=1&pl=18&initcwndbps=485000&vprv=1&mime=video%2Fmp4&ns=HxKGlDPCMEutowgOXiu9t0AG&ratebypass=yes&dur=235.636&lmt=1621860905566985&mt=1626540309&fvip=1&fexp=24001373%2C24007246&c=WEB&txp=6216222&n=C0wecA2c_xwhv0i9&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRQIgEZzknt5cwI4WUaQlpNQmszqQ9xxHeeDzxrpVStuMCJYCIQDzt0QM_QVBAoPIfUzb2yM0H3vkLEPqovXELTr7kuKzvg%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIhAM-m2QGByaG8vA10re8yaYtdD9wrxNayhWJP1LBIxjdnAiBwZlBt6bsEzj8WP234-CCU8vqt5B4xoXqFy8fvA8iCZQ%3D%3D",
            "width": 1280,
            "height": 720,
            "lastModified": "1621860905566985",
            "quality": "hd720",
            "fps": 30,
            "projectionType": "RECTANGULAR",
            "audioQuality": "AUDIO_QUALITY_MEDIUM",
            "approxDurationMs": "235636",
            "audioSampleRate": "44100",
            "audioChannels": 2,
            "hasVideo": true,
            "hasAudio": true,
            "container": "mp4",
            "codecs": "avc1.64001F, mp4a.40.2",
            "videoCodec": "avc1.64001F",
            "audioCodec": "mp4a.40.2",
            "isLive": false,
            "isHLS": false,
            "isDashMPD": false
        },
        {
            "mimeType": "video/webm; codecs=\"vp9\"",
            "qualityLabel": "1080p",
            "bitrate": 2646000,
            "audioBitrate": null,
            "itag": 248,
            "url": "https://r1---sn-xjiv15-j2ue.googlevideo.com/videoplayback?expire=1626562243&ei=YwrzYN61J93ZxgLV2ZzwBg&ip=41.198.132.50&id=o-AJf9IjLfqaJkDiIKgJr2niPhRYoPqJUVzwbuT4arAm4-&itag=248&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&source=yt_otf&requiressl=yes&mh=aE&mm=31%2C29&mn=sn-xjiv15-j2ue%2Csn-woc7ln7r&ms=au%2Crdu&mv=m&mvi=1&pl=18&initcwndbps=485000&vprv=1&mime=video%2Fwebm&ns=5OsqyMwBgujBx0dCWf7xfroG&otf=1&otfp=1&dur=0.000&lmt=1621860883837306&mt=1626540309&fvip=1&keepalive=yes&fexp=24001373%2C24007246&c=WEB&txp=6210222&n=V0h8AsLjJ28hUHOp&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cotf%2Cotfp%2Cdur%2Clmt&sig=AOq0QJ8wRQIhAOB9E9-TOeuI0hT_W0UaHWIsmZhlrEcUeyL_Zut7sW8PAiBCxT4_0YJJbUmmMPZEtW39goB8VjBx6VzVmFCLwP6KfQ%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIhAM-m2QGByaG8vA10re8yaYtdD9wrxNayhWJP1LBIxjdnAiBwZlBt6bsEzj8WP234-CCU8vqt5B4xoXqFy8fvA8iCZQ%3D%3D&ratebypass=yes",
            "width": 1920,
            "height": 1080,
            "lastModified": "1621860883837306",
            "quality": "hd1080",
            "fps": 30,
            "projectionType": "RECTANGULAR",
            "type": "FORMAT_STREAM_TYPE_OTF",
            "hasVideo": true,
            "hasAudio": false,
            "container": "webm",
            "codecs": "vp9",
            "videoCodec": "vp9",
            "audioCodec": null,
            "isLive": false,
            "isHLS": false,
            "isDashMPD": false
        },
        {
            "mimeType": "video/mp4; codecs=\"avc1.4d400c\"",
            "qualityLabel": "720p",
            "bitrate": 2310000,
            "audioBitrate": null,
            "itag": 136,
            "url": "https://r1---sn-xjiv15-j2ue.googlevideo.com/videoplayback?expire=1626562243&ei=YwrzYN61J93ZxgLV2ZzwBg&ip=41.198.132.50&id=o-AJf9IjLfqaJkDiIKgJr2niPhRYoPqJUVzwbuT4arAm4-&itag=136&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&source=yt_otf&requiressl=yes&mh=aE&mm=31%2C29&mn=sn-xjiv15-j2ue%2Csn-woc7ln7r&ms=au%2Crdu&mv=m&mvi=1&pl=18&initcwndbps=485000&vprv=1&mime=video%2Fmp4&ns=5OsqyMwBgujBx0dCWf7xfroG&otf=1&otfp=1&dur=0.000&lmt=1621860883837306&mt=1626540309&fvip=1&keepalive=yes&fexp=24001373%2C24007246&c=WEB&txp=6210222&n=V0h8AsLjJ28hUHOp&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cotf%2Cotfp%2Cdur%2Clmt&sig=AOq0QJ8wRAIgaVHjeNSyxcPbw0VOty-wX2Gtn8L-DC2HJW8inLmrPEACIB23Xpe4Po1fzTrWSsGFC6DNipiGX0klXyatCjFpQ0e9&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIhAM-m2QGByaG8vA10re8yaYtdD9wrxNayhWJP1LBIxjdnAiBwZlBt6bsEzj8WP234-CCU8vqt5B4xoXqFy8fvA8iCZQ%3D%3D&ratebypass=yes",
            "width": 1280,
            "height": 720,
            "lastModified": "1621860883837306",
            "quality": "hd720",
            "fps": 30,
            "projectionType": "RECTANGULAR",
            "type": "FORMAT_STREAM_TYPE_OTF",
            "hasVideo": true,
            "hasAudio": false,
            "container": "mp4",
            "codecs": "avc1.4d400c",
            "videoCodec": "avc1.4d400c",
            "audioCodec": null,
            "isLive": false,
            "isHLS": false,
            "isDashMPD": false
        },
        {
            "mimeType": "video/webm; codecs=\"vp9\"",
            "qualityLabel": "720p",
            "bitrate": 1505280,
            "audioBitrate": null,
            "itag": 247,
            "url": "https://r1---sn-xjiv15-j2ue.googlevideo.com/videoplayback?expire=1626562243&ei=YwrzYN61J93ZxgLV2ZzwBg&ip=41.198.132.50&id=o-AJf9IjLfqaJkDiIKgJr2niPhRYoPqJUVzwbuT4arAm4-&itag=247&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&source=yt_otf&requiressl=yes&mh=aE&mm=31%2C29&mn=sn-xjiv15-j2ue%2Csn-woc7ln7r&ms=au%2Crdu&mv=m&mvi=1&pl=18&initcwndbps=485000&vprv=1&mime=video%2Fwebm&ns=5OsqyMwBgujBx0dCWf7xfroG&otf=1&otfp=1&dur=0.000&lmt=1621860883837306&mt=1626540309&fvip=1&keepalive=yes&fexp=24001373%2C24007246&c=WEB&txp=6210222&n=V0h8AsLjJ28hUHOp&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cotf%2Cotfp%2Cdur%2Clmt&sig=AOq0QJ8wRgIhAO32f0z_HBoLxLrhai7CxxAaQGxqgCrkdc52zDieg9bjAiEA43iktmfwJ0Ea9eVd2Fd1XRCCwnrpZ8UdZa-c4KN2kic%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIhAM-m2QGByaG8vA10re8yaYtdD9wrxNayhWJP1LBIxjdnAiBwZlBt6bsEzj8WP234-CCU8vqt5B4xoXqFy8fvA8iCZQ%3D%3D&ratebypass=yes",
            "width": 1280,
            "height": 720,
            "lastModified": "1621860883837306",
            "quality": "hd720",
            "fps": 30,
            "projectionType": "RECTANGULAR",
            "type": "FORMAT_STREAM_TYPE_OTF",
            "hasVideo": true,
            "hasAudio": false,
            "container": "webm",
            "codecs": "vp9",
            "videoCodec": "vp9",
            "audioCodec": null,
            "isLive": false,
            "isHLS": false,
            "isDashMPD": false
        },
        {
            "mimeType": "video/mp4; codecs=\"avc1.4d4014\"",
            "qualityLabel": "480p",
            "bitrate": 1155000,
            "audioBitrate": null,
            "itag": 135,
            "url": "https://r1---sn-xjiv15-j2ue.googlevideo.com/videoplayback?expire=1626562243&ei=YwrzYN61J93ZxgLV2ZzwBg&ip=41.198.132.50&id=o-AJf9IjLfqaJkDiIKgJr2niPhRYoPqJUVzwbuT4arAm4-&itag=135&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&source=yt_otf&requiressl=yes&mh=aE&mm=31%2C29&mn=sn-xjiv15-j2ue%2Csn-woc7ln7r&ms=au%2Crdu&mv=m&mvi=1&pl=18&initcwndbps=485000&vprv=1&mime=video%2Fmp4&ns=5OsqyMwBgujBx0dCWf7xfroG&otf=1&otfp=1&dur=0.000&lmt=1621860883837306&mt=1626540309&fvip=1&keepalive=yes&fexp=24001373%2C24007246&c=WEB&txp=6210222&n=V0h8AsLjJ28hUHOp&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cotf%2Cotfp%2Cdur%2Clmt&sig=AOq0QJ8wRAIgNRKgyhQOI0JZrnx5e10DVm_2aDH4IKXaiJQWqFUntdkCIHWij1H_qdOMPkYytZ9RovJDuENrzYUmYpJ56DGWG9F7&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIhAM-m2QGByaG8vA10re8yaYtdD9wrxNayhWJP1LBIxjdnAiBwZlBt6bsEzj8WP234-CCU8vqt5B4xoXqFy8fvA8iCZQ%3D%3D&ratebypass=yes",
            "width": 854,
            "height": 480,
            "lastModified": "1621860883837306",
            "quality": "large",
            "fps": 30,
            "projectionType": "RECTANGULAR",
            "type": "FORMAT_STREAM_TYPE_OTF",
            "hasVideo": true,
            "hasAudio": false,
            "container": "mp4",
            "codecs": "avc1.4d4014",
            "videoCodec": "avc1.4d4014",
            "audioCodec": null,
            "isLive": false,
            "isHLS": false,
            "isDashMPD": false
        },
        {
            "mimeType": "video/webm; codecs=\"vp9\"",
            "qualityLabel": "480p",
            "bitrate": 752640,
            "audioBitrate": null,
            "itag": 244,
            "url": "https://r1---sn-xjiv15-j2ue.googlevideo.com/videoplayback?expire=1626562243&ei=YwrzYN61J93ZxgLV2ZzwBg&ip=41.198.132.50&id=o-AJf9IjLfqaJkDiIKgJr2niPhRYoPqJUVzwbuT4arAm4-&itag=244&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&source=yt_otf&requiressl=yes&mh=aE&mm=31%2C29&mn=sn-xjiv15-j2ue%2Csn-woc7ln7r&ms=au%2Crdu&mv=m&mvi=1&pl=18&initcwndbps=485000&vprv=1&mime=video%2Fwebm&ns=5OsqyMwBgujBx0dCWf7xfroG&otf=1&otfp=1&dur=0.000&lmt=1621860883837306&mt=1626540309&fvip=1&keepalive=yes&fexp=24001373%2C24007246&c=WEB&txp=6210222&n=V0h8AsLjJ28hUHOp&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cotf%2Cotfp%2Cdur%2Clmt&sig=AOq0QJ8wRQIgZ_vMcPGl8q14ZbSJohuyPXq8fZNAXi3bGnzqwKmHKf0CIQCZ__o573S8nTdppKwwFLw5X8nECrjicdiR6SBHlz2fvw%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIhAM-m2QGByaG8vA10re8yaYtdD9wrxNayhWJP1LBIxjdnAiBwZlBt6bsEzj8WP234-CCU8vqt5B4xoXqFy8fvA8iCZQ%3D%3D&ratebypass=yes",
            "width": 854,
            "height": 480,
            "lastModified": "1621860883837306",
            "quality": "large",
            "fps": 30,
            "projectionType": "RECTANGULAR",
            "type": "FORMAT_STREAM_TYPE_OTF",
            "hasVideo": true,
            "hasAudio": false,
            "container": "webm",
            "codecs": "vp9",
            "videoCodec": "vp9",
            "audioCodec": null,
            "isLive": false,
            "isHLS": false,
            "isDashMPD": false
        },
        {
            "mimeType": "video/webm; codecs=\"vp9\"",
            "qualityLabel": "360p",
            "bitrate": 405720,
            "audioBitrate": null,
            "itag": 243,
            "url": "https://r1---sn-xjiv15-j2ue.googlevideo.com/videoplayback?expire=1626562243&ei=YwrzYN61J93ZxgLV2ZzwBg&ip=41.198.132.50&id=o-AJf9IjLfqaJkDiIKgJr2niPhRYoPqJUVzwbuT4arAm4-&itag=243&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&source=yt_otf&requiressl=yes&mh=aE&mm=31%2C29&mn=sn-xjiv15-j2ue%2Csn-woc7ln7r&ms=au%2Crdu&mv=m&mvi=1&pl=18&initcwndbps=485000&vprv=1&mime=video%2Fwebm&ns=5OsqyMwBgujBx0dCWf7xfroG&otf=1&otfp=1&dur=0.000&lmt=1621860883837306&mt=1626540309&fvip=1&keepalive=yes&fexp=24001373%2C24007246&c=WEB&txp=6210222&n=V0h8AsLjJ28hUHOp&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cotf%2Cotfp%2Cdur%2Clmt&sig=AOq0QJ8wRQIhAIhaq9c3Rmi9MszjzejE5xY_Xh0h4jQEjhhV83ocAtIdAiBIRSI5tpxXqRTKbLiUPLb28a5T5nvByqNveUNVcS_hbw%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIhAM-m2QGByaG8vA10re8yaYtdD9wrxNayhWJP1LBIxjdnAiBwZlBt6bsEzj8WP234-CCU8vqt5B4xoXqFy8fvA8iCZQ%3D%3D&ratebypass=yes",
            "width": 640,
            "height": 360,
            "lastModified": "1621860883837306",
            "quality": "medium",
            "fps": 30,
            "projectionType": "RECTANGULAR",
            "type": "FORMAT_STREAM_TYPE_OTF",
            "hasVideo": true,
            "hasAudio": false,
            "container": "webm",
            "codecs": "vp9",
            "videoCodec": "vp9",
            "audioCodec": null,
            "isLive": false,
            "isHLS": false,
            "isDashMPD": false
        },
        {
            "mimeType": "video/mp4; codecs=\"avc1.4d400c\"",
            "qualityLabel": "240p",
            "bitrate": 242000,
            "audioBitrate": null,
            "itag": 133,
            "url": "https://r1---sn-xjiv15-j2ue.googlevideo.com/videoplayback?expire=1626562243&ei=YwrzYN61J93ZxgLV2ZzwBg&ip=41.198.132.50&id=o-AJf9IjLfqaJkDiIKgJr2niPhRYoPqJUVzwbuT4arAm4-&itag=133&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&source=yt_otf&requiressl=yes&mh=aE&mm=31%2C29&mn=sn-xjiv15-j2ue%2Csn-woc7ln7r&ms=au%2Crdu&mv=m&mvi=1&pl=18&initcwndbps=485000&vprv=1&mime=video%2Fmp4&ns=5OsqyMwBgujBx0dCWf7xfroG&otf=1&otfp=1&dur=0.000&lmt=1621860883837306&mt=1626540309&fvip=1&keepalive=yes&fexp=24001373%2C24007246&c=WEB&txp=6210222&n=V0h8AsLjJ28hUHOp&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cotf%2Cotfp%2Cdur%2Clmt&sig=AOq0QJ8wRQIhALwr7ZPSsXQ7pvfEid3wnbybyfPngtL4spGrv-0FJFJ9AiAFIwINXNmbwoC94I73OBoflXbBpjgE4w6ufaepmgym8Q%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIhAM-m2QGByaG8vA10re8yaYtdD9wrxNayhWJP1LBIxjdnAiBwZlBt6bsEzj8WP234-CCU8vqt5B4xoXqFy8fvA8iCZQ%3D%3D&ratebypass=yes",
            "width": 426,
            "height": 240,
            "lastModified": "1621860883837306",
            "quality": "small",
            "fps": 30,
            "projectionType": "RECTANGULAR",
            "type": "FORMAT_STREAM_TYPE_OTF",
            "hasVideo": true,
            "hasAudio": false,
            "container": "mp4",
            "codecs": "avc1.4d400c",
            "videoCodec": "avc1.4d400c",
            "audioCodec": null,
            "isLive": false,
            "isHLS": false,
            "isDashMPD": false
        },
        {
            "mimeType": "video/webm; codecs=\"vp9\"",
            "qualityLabel": "240p",
            "bitrate": 220500,
            "audioBitrate": null,
            "itag": 242,
            "url": "https://r1---sn-xjiv15-j2ue.googlevideo.com/videoplayback?expire=1626562243&ei=YwrzYN61J93ZxgLV2ZzwBg&ip=41.198.132.50&id=o-AJf9IjLfqaJkDiIKgJr2niPhRYoPqJUVzwbuT4arAm4-&itag=242&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&source=yt_otf&requiressl=yes&mh=aE&mm=31%2C29&mn=sn-xjiv15-j2ue%2Csn-woc7ln7r&ms=au%2Crdu&mv=m&mvi=1&pl=18&initcwndbps=485000&vprv=1&mime=video%2Fwebm&ns=5OsqyMwBgujBx0dCWf7xfroG&otf=1&otfp=1&dur=0.000&lmt=1621860883837306&mt=1626540309&fvip=1&keepalive=yes&fexp=24001373%2C24007246&c=WEB&txp=6210222&n=V0h8AsLjJ28hUHOp&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cotf%2Cotfp%2Cdur%2Clmt&sig=AOq0QJ8wRQIhAOePfHB39ExnDUQZVtnTbnnm7g8YsCUYsKkFpt4DZmW-AiBAdCF9MbvrXXEQbkk9LyNq8oyUt7hFe5ApUNZrJY5YJQ%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIhAM-m2QGByaG8vA10re8yaYtdD9wrxNayhWJP1LBIxjdnAiBwZlBt6bsEzj8WP234-CCU8vqt5B4xoXqFy8fvA8iCZQ%3D%3D&ratebypass=yes",
            "width": 426,
            "height": 240,
            "lastModified": "1621860883837306",
            "quality": "small",
            "fps": 30,
            "projectionType": "RECTANGULAR",
            "type": "FORMAT_STREAM_TYPE_OTF",
            "hasVideo": true,
            "hasAudio": false,
            "container": "webm",
            "codecs": "vp9",
            "videoCodec": "vp9",
            "audioCodec": null,
            "isLive": false,
            "isHLS": false,
            "isDashMPD": false
        },
        {
            "mimeType": "video/mp4; codecs=\"avc1.4d400b\"",
            "qualityLabel": "144p",
            "bitrate": 108000,
            "audioBitrate": null,
            "itag": 160,
            "url": "https://r1---sn-xjiv15-j2ue.googlevideo.com/videoplayback?expire=1626562243&ei=YwrzYN61J93ZxgLV2ZzwBg&ip=41.198.132.50&id=o-AJf9IjLfqaJkDiIKgJr2niPhRYoPqJUVzwbuT4arAm4-&itag=160&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&source=yt_otf&requiressl=yes&mh=aE&mm=31%2C29&mn=sn-xjiv15-j2ue%2Csn-woc7ln7r&ms=au%2Crdu&mv=m&mvi=1&pl=18&initcwndbps=485000&vprv=1&mime=video%2Fmp4&ns=5OsqyMwBgujBx0dCWf7xfroG&otf=1&otfp=1&dur=0.000&lmt=1621860883837306&mt=1626540309&fvip=1&keepalive=yes&fexp=24001373%2C24007246&c=WEB&txp=6210222&n=V0h8AsLjJ28hUHOp&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cotf%2Cotfp%2Cdur%2Clmt&sig=AOq0QJ8wRQIgd0CiJ0U3vKyLcK-7PHooiEaToaXTHlCZoWhkPnrtWtcCIQD2Q9rQpiu-IA1Vtqb50tGw0eHnuxGquV0JRAs-cLkFUg%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIhAM-m2QGByaG8vA10re8yaYtdD9wrxNayhWJP1LBIxjdnAiBwZlBt6bsEzj8WP234-CCU8vqt5B4xoXqFy8fvA8iCZQ%3D%3D&ratebypass=yes",
            "width": 256,
            "height": 144,
            "lastModified": "1621860883837306",
            "quality": "tiny",
            "fps": 30,
            "projectionType": "RECTANGULAR",
            "type": "FORMAT_STREAM_TYPE_OTF",
            "hasVideo": true,
            "hasAudio": false,
            "container": "mp4",
            "codecs": "avc1.4d400b",
            "videoCodec": "avc1.4d400b",
            "audioCodec": null,
            "isLive": false,
            "isHLS": false,
            "isDashMPD": false
        },
        {
            "mimeType": "video/webm; codecs=\"vp9\"",
            "qualityLabel": "144p",
            "bitrate": 95000,
            "audioBitrate": null,
            "itag": 278,
            "url": "https://r1---sn-xjiv15-j2ue.googlevideo.com/videoplayback?expire=1626562243&ei=YwrzYN61J93ZxgLV2ZzwBg&ip=41.198.132.50&id=o-AJf9IjLfqaJkDiIKgJr2niPhRYoPqJUVzwbuT4arAm4-&itag=278&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&source=yt_otf&requiressl=yes&mh=aE&mm=31%2C29&mn=sn-xjiv15-j2ue%2Csn-woc7ln7r&ms=au%2Crdu&mv=m&mvi=1&pl=18&initcwndbps=485000&vprv=1&mime=video%2Fwebm&ns=5OsqyMwBgujBx0dCWf7xfroG&otf=1&otfp=1&dur=0.000&lmt=1621860883837306&mt=1626540309&fvip=1&keepalive=yes&fexp=24001373%2C24007246&c=WEB&txp=6210222&n=V0h8AsLjJ28hUHOp&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cotf%2Cotfp%2Cdur%2Clmt&sig=AOq0QJ8wRQIhAJuB3fruwYoWtCyW_BLB-0KX3HgZ60-rbwOUkg3d3qwxAiBEZUvTYyUk8GF1tFJxLyZLuZhcuV34iiHBlYusss_76A%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIhAM-m2QGByaG8vA10re8yaYtdD9wrxNayhWJP1LBIxjdnAiBwZlBt6bsEzj8WP234-CCU8vqt5B4xoXqFy8fvA8iCZQ%3D%3D&ratebypass=yes",
            "width": 256,
            "height": 144,
            "lastModified": "1621860883837306",
            "quality": "tiny",
            "fps": 30,
            "projectionType": "RECTANGULAR",
            "type": "FORMAT_STREAM_TYPE_OTF",
            "hasVideo": true,
            "hasAudio": false,
            "container": "webm",
            "codecs": "vp9",
            "videoCodec": "vp9",
            "audioCodec": null,
            "isLive": false,
            "isHLS": false,
            "isDashMPD": false
        }
    ],
    "thumbnail": {
        "url": "https://i.ytimg.com/vi/X1gVR7bxAw4/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLCFxaHNTF0_PnYHEPwzqsUQYk9Hrw",
        "width": 168,
        "height": 94
    },
    "title": "Best Trumpet VST - Top 5 Trumpet Plugins of 2021 🎺🎺🎺",
    "lengthSeconds": "236"
}