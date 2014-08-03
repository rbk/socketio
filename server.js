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

PONG GAME!!!

Dynamic Pages and posts

Template engine

How to import js files here?!?!?!

****/


// Project name: SocketIO
var express      = require('express');
var app          = express();
var fs = require('fs');
var http         = require('http').Server(app);
var io           = require('socket.io')(http);
var mongoose     = require('mongoose');
var cookieParser = require('cookie-parser');
var port         = process.env.PORT || 3001;
var router = express.Router();

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

// DEFINE collections
var Chat = mongoose.model( 'Chat', {
    name: String,
    message: String,
    time: Date
});
var Session = mongoose.model( 'Session', {
    type: String,
    name: String,
    ip: String,
    socket_id: String,
    message_count: Number,
    duration: Number
});

// Static routes
app.get('/',            function(req, res){ res.render('index'); });
app.get('/chat',        function(req, res){ res.render('chat', { title: 'Chat' }); });
app.get('/rproxy',      function(req, res){ res.render('proxy-nginx'); });
app.get('/template',    function(req, res){ res.render('template'); });

// API
app.get('/api/:id?', function(req, res, next) {
    // ... maybe some additional /bar logging ...
    console.log( 'you hit our api' );
    res.end(JSON.stringify( req.params.id ));
    // next();
});



// Connection made to socket
io.on('connection', function(socket){
    //:: On connect
    // 1. ask for nick name
    // 2. create cooke with name
    // 3. store name in database
    // 4. add send name to client
    // 5. add name to user list on client

    // :: Leave chat
    // 1. remove user from database
    // 2. update user list on clients

    //:: Return to chat
    // 1. check for cookie
    // 2.  if cookie send chat room

    // Get ALL messages
    Chat.find({ },function (err, messages) {
        if (err) return console.error(err);
        // Send all messages to client as object
        socket.emit('connected', messages);
    });

    // var session = new User({ name: '-', ip: 'ip'  });
    // session.save(function (err) {
    //     if( err ){
    //         console.log( err )
    //     }
    // });

// console.log( socket.handshake.headers.cookie )



    // Someone sends a message
    socket.on('chat message', function(msg){
        // Save Message to MongoDB
        // Handle errors ***
        var message = new Chat({ name: 'Zildjian', message: msg });
        message.save(function (err) {
            if( err ){
                io.emit('chat message', 'Something went wrong while saving your message');
            } else {
                console.log( 'Message saved to MongoDB: ' + msg );
            }
        });
        // Broadcast message
        io.emit('chat message', msg);
    });
    socket.on('mouse_position', function(pos){
        pos.id = socket.id;
        socket.broadcast.emit('show_mouse', pos)
    });


    // On disconnect
    socket.on('disconnect', function( res ){
        // console.log( socket.id )
        socket.broadcast.emit('remove_cursor', socket.id );
    });


}); // end io connect


// Start server
http.listen(port, function(){
    console.log('listening on port ' + port);
});
