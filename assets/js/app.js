$(function(){
/*
*
*	Chat room logic
*
**/
	var socket = io();
	var nickname = 'richard';
	var message_tempate = $('#message-li').html();

	// Connected
	socket.on('connected', function (data) {
		if( $('#messages').length > 0 ){
			for( i in data ){
				$('#messages').append( 
					message_tempate.replace('{{name}}', data[i].name ).replace('{{message}}', data[i].message) 
				);
			}
			$('#message-board').scrollTop( $('#messages').height() + 100 );
		}
	});
	// Send Message
	$('#send-message').click(function(){
		var message = $('#message').val();
		if( message.length > 0 ){
			socket.emit('chat message', message);
			$('#message').val('');
		}
		return false;
	});
	// Receive Message
	socket.on('chat message', function(msg){
			$('#messages').append( 
				message_tempate.replace('{{name}}', 'Nickname' ).replace('{{message}}', msg ) 
			);
		$('#message-board').scrollTop( $('#messages').height() + 100 )
	});
	// check for cookie on connection
	// If has cookie with user name then don't show modal

	// console.log($.cookie('user_session_id'));
	$('#select-nickname').click(function(){
		$('#chatModal').modal('hide')
	});
	// $('#chatModal').modal()


/*
*
*
*
*	weird cursor thing
*
*
**/
	// Send your mouse position to all other sockets
	window.onmousemove = handleMouseMove;
	function handleMouseMove(event) {
		event = event || window.event; // IE-ism
		// console.log( event.clientX + ' ' + event.clientY );
		socket.emit('mouse_position', { x: event.clientX, y: event.clientY } );
	}
	// Remove your cursor when you disconnect
	socket.on( 'remove_cursor', function(id){
		if( $('#' + id).length > 0 ){
			$('#' + id).remove();
		}
	});
	// Create your cursor for all other people and set position
	socket.on( 'show_mouse', function(pos){
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
// console.log($.cookie());