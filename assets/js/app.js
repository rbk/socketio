$(function(){

	var socket = io();
	var username = 'richard';

	// Send Message
	$('form').submit(function(){
		socket.emit('chat message', $('#m').val());
		$('#m').val('');
		return false;
	});
	// Receive Message
	socket.on('chat message', function(msg){
		$('#messages').append($('<li>').text(username + ': ' +msg));
		$('#message-board').scrollTop( $('#messages').height() + 100 )
	});

	// Connected
	socket.on('connected', function (data) {
		// console.log( 'This object was broadcasted when you connected: ');
		// console.log( data );
		for( i in data ){
			$('#messages').append($('<li>').text(data[i].name + ': ' + data[i].message));
		}
		$('#message-board').scrollTop( $('#messages').height() + 100 )
	});
});