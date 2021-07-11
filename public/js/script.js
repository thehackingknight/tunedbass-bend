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
    