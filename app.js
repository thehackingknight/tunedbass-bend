let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let logger = require('morgan');
let { router} = require('./routes/index');
let usersRouter = require('./routes/users');
let songsRouter = require('./routes/songs');
let songRouter = require('./routes/song');
let fileRouter = require('./routes/file');
let userRouter = require('./routes/user');
let authRouter = require('./routes/auth');
let {uploadRouter} = require('./routes/upload');
let downloadRouter = require('./routes/download');
const fileupload = require("express-fileupload");

const cors = require('cors');
const dotenv = require('dotenv');



dotenv.config()

//Connect DB

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors())
app.options('*', cors());

app.use(logger('dev'));
app.use(bodyParser.raw({type: 'application/octet-stream', limit: '100mb'}))

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
//app.use(fileupload());
app.get('/express_backend', (req, res) => { //Line 9
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); //Line 10
});

let corsOpions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}
app.post('/cors', cors(corsOpions), (req, res)=>{

  res.send('Corsos')

})


app.use('/auth', authRouter)
app.use('/upload', uploadRouter)
app.use('/download', downloadRouter)
app.use('/', router);
app.use('/users', usersRouter);
app.use('/songs', songsRouter);
app.use('/song', songRouter);
app.use('/user', userRouter);
app.use('/file', fileRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app};
