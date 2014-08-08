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
			socket.emit('chat message', {name: $('#client_nickname').val(), message: message });
			$('#message').val('');
		}
		return false;
	});
	// Receive Message
	socket.on('chat message', function(data){
		console.log(data);
			$('#messages').append( 
				message_tempate.replace('{{name}}', data.name ).replace('{{message}}', data.message.message ) 
			);
		$('#message-board').scrollTop( $('#messages').height() + 100 )
	});
	// check for cookie on connection
	// If has cookie with user name then don't show modal

	// console.log($.cookie('user_session_id'));
	$('#select-nickname').click(function(){
		var your_nickname = $('#your_nickname').val();
		$('#chatModal').modal('hide');
		socket.emit('nickname selected', your_nickname );
		$('#client_nickname').val( your_nickname );
		$('#message').focus();
	});
	$('#chatModal').modal();
	
	socket.on('update user list',function(users){
		console.log(users);
		$('#user-list li').remove();
		for( var i=0;i<users.length;i++ ){
			$('#user-list').append('<li>'+users[i].nickname+'</li>');
		}
		$('#message-board').scrollTop( $('#messages').height() + 100 );
	});
	socket.on('joined',function(name){
		$('#messages').append(message_tempate.replace('{{name}}', 'Server' ).replace('{{message}}', name + ' has joined.' ));

	});

/*
*
*
*
*	weird cursor thing
*
*
**/
	// Send your mouse position to all other sockets
	// window.onmousemove = handleMouseMove;
	// function handleMouseMove(event) {
	// 	event = event || window.event; // IE-ism
	// 	// console.log( event.clientX + ' ' + event.clientY );
	// 	socket.emit('mouse_position', { x: event.clientX, y: event.clientY } );
	// }
	// // Remove your cursor when you disconnect
	// socket.on( 'remove_cursor', function(id){
	// 	if( $('#' + id).length > 0 ){
	// 		$('#' + id).remove();
	// 	}
	// });
	// // Create your cursor for all other people and set position
	// socket.on( 'show_mouse', function(pos){
	// 	if( $('#' + pos.id).length == 0 ){
	// 		var cursor = document.createElement('i');
	// 		cursor.classList.add('fa');
	// 		cursor.classList.add('fa-bomb');
	// 		cursor.classList.add('cursor');
	// 		cursor.setAttribute("id", pos.id);
	// 		document.body.appendChild(cursor);
	// 	}
	// 	$('i#' + pos.id).css({
	// 		top : pos.y -20,
	// 		left : pos.x -20
	// 	});
	// });



});
// console.log($.cookie());