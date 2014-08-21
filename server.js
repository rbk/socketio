/*
Todos

Complete CRUD
User auth
User list
Secure api
Dynamic Collections, for chat embed service type of thing
Use a css framework to make it look good

build simple authentication
store user list in chatroom
remove user when they close window
make chatrooms embeddable

Richard: Tokenize generation of a chatroom
Richard: Namespace chat

PONG GAME!!!

Dynamic Pages and posts

How to import js files here?!?!?!

****/
// Project name: SocketIO


// Base Server
var express      = require('express');
var app          = express();
var http         = require('http').Server(app);
var io           = require('socket.io')(http);
var port         = process.env.PORT || 3001;

// Database of choice
var mongoose     = require('mongoose');

// Extras
var cookieParser = require('cookie-parser');
var router       = express.Router();
var sanitizer    = require('sanitizer');
var bodyParser   = require('body-parser');
var md5          = require('MD5');
var fs           = require('fs');

// Require files
include( 'chat.js' )

function include( filename ){
    eval(fs.readFileSync(filename));
}

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded() ); // to support URL-encoded bodies


// Session stuff
var session    = require('express-session');
var MongoStore = require('connect-mongo')(session);

// Set static file folder
app.use(express.static('assets'));
// app.use(express.static('public'));

// Set the template engine
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

// app.engine('html', require('ejs').renderFile);

// Cookie Parser
app.use(cookieParser('secret-string'));
// app.use(function(req, res, next){
//    res.end(JSON.stringify(req.cookies));
// })

// Log HTTP requests
var logger = require('morgan');
app.use(logger(':remote-addr :method :url'));

// MongoDB Connection
mongoose.connect('mongodb://localhost/socketio');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log('Connected to MongoDB!!!');
});


// MongoDB Session Store
app.use(session({
    secret: 'secret-cookie-string',
    name: 'user_session_id',
    cookie: { path: '/', httpOnly: true, secure: false, maxAge: 1209600 },
    store: new MongoStore({
        db: 'socketio',
        collection: 'sessions',
        host: '127.0.0.1',
        port: 27017,
        username: '',
        password: '',
        ssl: false,
        mongoose_connection: db
    })
}));

// GET Session ID
app.get('/session',function(req, res, next) {
    var session = req.session;
    res.setHeader('Content-Type', 'text/html');
    res.send( req.session.id );
    res.end();
})

// DEFINE Collections/Models
var Chat = mongoose.model( 'Message', {
    name: String,
    message: String,
    time: Date
});
var ChatUser = mongoose.model( 'ChatUser', {
    nickname: String,
    socket_id: String,
    session_id: String,
    message_count: Number
});
var User = mongoose.model( 'User', {
    username: String,
    hashed_password: String
});
var Session = mongoose.model( 'Session', {
    type: String,
    name: String,
    ip: String,
    duration: Number
});
var Key = mongoose.model( 'Key', {
    belongs_to: String,
    key: String
});

// Static routes
app.get('/',            function(req, res){ res.render('index'); });
app.get('/chat',        function(req, res){ res.render('chat', { title: 'Chat' }); });

app.get('/test/:id?', function(req,res){
    res.render('chat', { title:'blah', channel: 'channel1' });
});

app.get( '/admin', function(req,res){
    res.render( 'admin' );
    res.end();
});

// app.get('/create-user', function(req,res){

//     var user = new User({ username: 'richard', hashed_password: md5('password') });
//     user.save(function (err) {
//         if( !err ){
//             res.send(user);
//         } else {
//             res.send(err);
//         }
//     });
// });

app.get( '/login', function(req,res){
    // console.log( req.params )
    if( !req.params ) {
        res.redirect('chat');
    } else {
        res.render( 'login' );
        res.end();
    }
});

app.post('/sessions', function(req,res){
    var username = req.body.username.toLowerCase();
    var password = md5(req.body.password);
    
    // Chat.find({ },function (err, messages) {
    User.find({ username: username, hashed_password: password },function(err,user){
        if( !err ){
            if( user.length > 0 ){
                console.log('user FOUND')
                res.send('you have done it');
            } else {
                console.log('NO USERS')
                res.redirect('login?error=1'); 
                // res.render( 'login',{ message: 'Invalid credentials' });
            }
        } else {
            console.log( err )
        }
    });
});
app.get('/sessions', function(req,res){
    // res.redirect('/');
    Session.find({}, function(err,sessions){
        res.json( sessions );
    });
});

// JSON.stringify( req.params )
app.get('/private/api_key/:id?', function( req, res ){
    var api_key = req.params;
    res.send(req._remoteAddress);
    res.end();
});


// API
app.get('/api/:id?', function(req, res, next) {
    console.log( 'you hit our api' );
    res.send(JSON.stringify( req.params.id ));
    // next();
});



// Start server
http.listen(port, function(){
    console.log('listening on port ' + port);
});
