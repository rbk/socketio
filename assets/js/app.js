$(function(){
/*
*
*	Chat room logic
*
**/
	var socket = io();
	var nickname = 'richard';
	var message_tempate = $('#message-li').html();

	socket.on('your socket id', function(id){
		// console.log( 'Your socket id:' + id );
	});
	

	// Connected
	socket.on('connected', function (data) {
		console.log(data )
		if( $('#messages').length > 0 ){
			for( var i=0; i<data.length;i++ ){
				rbk_message( data[i].name, data[i].message );
				// $('#messages').append( 
				// 	message_tempate.replace('{{name}}', data[i].nickname ).replace('{{message}}', data[i].message) 
				// );
			}
		}
	});


	// Send Message
	$('#send-message').click(function(){
		var message = $('#message').val();
		var nickname = $('#client_nickname').val();
		if( message.length > 0 ){
			socket.emit('chat message', {nickname: nickname, message: message });
			$('#message').val('');
		}
		return false;
	});


	// Receive Message
	socket.on('chat message', function(data){
		rbk_message( data.nickname, data.message );
		$('#message-board').scrollTop( $('#messages').height() + 100 )
	});


	function rbk_message( name, msg ){
		message_tempate = $('#message-li').html();
		message_tempate = message_tempate.replace('{{name}}', name );
		var new_message = message_tempate.replace('{{message}}', msg );
		$('#messages').append(new_message);
		$('#message-board').scrollTop( $('#messages').height() + 100 );
	}


	// If has cookie with user name then don't show modal // check for cookie on connection
	$.get('/session', function(session_id){
		if( session_id ){
			socket.emit('check user', session_id);
		}
	});


	socket.on( 'get nickname', function(user){
		if( user.newuser ){
			$('#chatModal').modal();
		} else {
			$('#user-list').append( '<li class="'+user.socket_id+'">'+user.nickname+'</li>' );
		}
	});


	socket.on( 'remove user', function(id){
		$('.'+id).remove();
		$('#messages').append( 
			message_tempate.replace('{{name}}', 'System' ).replace('{{message}}', 'Someone left??' ) 
		);

	});


// GOOD

	// Open modal
	$('#chatModal').modal();
	// close modal on enter key
	$('#your_nickname').bind('keydown', function(e){
		if (e.keyCode == 13) {
			$('#chatModal').modal('hide');
		}
	});
	// Wait for theme to select a name
	$('#select-nickname').click(function(){
		$('#chatModal').modal('hide');
	});
	// Close modal and set name
	$('#chatModal').on('hidden.bs.modal', function () {
		
		$('#chatModal').modal('hide');
		var your_nickname = $('#your_nickname');
		if( your_nickname.val().length ){
			your_nickname = your_nickname.val();
		} else {
			your_nickname = 'Guest' + Math.floor(Math.random()*4000);
		}

		$('#client_nickname').val( your_nickname );
		socket.emit( 'set username', your_nickname);
		$('#message').focus();

	});

// GOOD
	socket.on('update user list',function(users){
		$('#user-list li').remove();
		for( var i=0;i<users.length;i++ ){
			$('#user-list').append('<li>'+users[i].nickname+'</li>');
		}
		$('#message-board').scrollTop( $('#messages').height() + 100 );
	});
	socket.on('joined',function(name){
		rbk_message( 'Server', name );
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
