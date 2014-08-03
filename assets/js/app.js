$(function(){

	var socket = io();
	var username = 'richard';

	// Send Message
	$('form').submit(function(){
		var message = $('#m').val();
		if( message.length > 0 ){
			socket.emit('chat message', message);
			$('#m').val('');
		} else {
			// alert( 'no no no' );
		}
		return false;
	});
	
	// Receive Message
	socket.on('chat message', function(msg){
		$('#messages').append($('<li>').text(username + ': ' +msg));
		$('#message-board').scrollTop( $('#messages').height() + 100 )
	});

	// Connected
	socket.on('connected', function (data) {
		// console.log( socket )

		// console.log( 'This object was broadcasted when you connected: ');
		console.log( data );
		for( i in data ){
			$('#messages').append($('<li>').text(data[i].name + ': ' + data[i].message));
		}
		$('#message-board').scrollTop( $('#messages').height() + 100 )
	});
	window.onmousemove = handleMouseMove;
	function handleMouseMove(event) {
		event = event || window.event; // IE-ism
		// console.log( event.clientX + ' ' + event.clientY );
		socket.emit('mouse_position', { x: event.clientX, y: event.clientY } );
	}

	socket.on( 'remove_cursor', function(id){
		if( $('#' + id).length > 0 ){
			$('#' + id).remove();
		}
	});
	

	socket.on( 'show_mouse', function(pos){
		// console.log( io.sockets.clients() )
		if( $('#' + pos.id).length == 0 ){
			var cursor = document.createElement('i');
			cursor.classList.add('fa');
			cursor.classList.add('fa-bomb');
			cursor.classList.add('cursor');
			cursor.setAttribute("id", pos.id);
			document.body.appendChild(cursor);
		}
		$('i#' + pos.id).css({
			top : pos.y -20,
			left : pos.x -20
		});
	});

});
