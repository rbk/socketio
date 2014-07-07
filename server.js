var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/my_database');

var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback () {
	  // yay!
	  console.log('woot woot!');
});

// Static routes
app.get('/', function(req, res){ res.sendfile('index.html'); });
app.get('/chat', function(req, res){ res.sendfile('chat.html'); });
app.get('/rproxy', function(req, res){ res.sendfile('how-to-setup-a-reverse-proxy-nginx.html'); });
app.get('/template', function(req, res){ res.sendfile('template.html'); });

app.use(express.static('assets'));
app.use(express.static('public'));

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});
