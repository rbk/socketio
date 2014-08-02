// Project name: SocketIO
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var port = process.env.PORT || 3001;

// Log HTTP requests
var logger = require('morgan');
app.use(logger(':remote-addr :method :url'));

// MongoDB Connection
mongoose.connect('mongodb://localhost/socketio');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log('Connected to MongoDB');
});

// DEFINE collections
var Chat = mongoose.model( 'Chat', {
    name: String,
    message: String
});
// ...
// DEFINE params to save
// ...


// Static routes
app.get('/', function(req, res){ res.sendfile('index.html'); });
app.get('/chat', function(req, res){ res.sendfile('chat.html'); });
app.get('/rproxy', function(req, res){ res.sendfile('how-to-setup-a-reverse-proxy-nginx.html'); });
app.get('/template', function(req, res){ res.sendfile('template.html'); });

app.use(express.static('assets'));
app.use(express.static('public'));

// Connection made to socket
io.on('connection', function(socket){
    // Get ALL messages
    Chat.find({ },function (err, messages) {
        if (err) return console.error(err);
        // Send all messages to client as object
        socket.emit('connected', messages);
    });

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


}); // end io connect


// Start server
http.listen(port, function(){
    console.log('listening on port ' + port);
});
