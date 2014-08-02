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
// var chatSchema = mongoose.Schema({
//     name: String,
//     message: String
// });

// Static routes
app.get('/', function(req, res){ res.sendfile('index.html'); });
app.get('/chat', function(req, res){ res.sendfile('chat.html'); });
app.get('/rproxy', function(req, res){ res.sendfile('how-to-setup-a-reverse-proxy-nginx.html'); });
app.get('/template', function(req, res){ res.sendfile('template.html'); });

app.use(express.static('assets'));
app.use(express.static('public'));

io.on('connection', function(socket){
  socket.on('chat message', function(msg){

	// var Chat = mongoose.model('Chat', chatSchema)
  	// Chat.save({name:"", message: msg});
  	// var new_message = new Chat({name:"", message: msg});
  	// if( new_message ){
  	// 	new_message.save();
  	// }

    io.emit('chat message', msg);
  });
  socket.emit('connected', { hello: 'world' });
});

<<<<<<< HEAD

http.listen(3000, function(){
  console.log('listening on *:3000');
=======
http.listen(3001, function(){
  console.log('listening on *:3001');
>>>>>>> 53ff4a86c16a587b02d494ae03a771b73fe6f162
});
