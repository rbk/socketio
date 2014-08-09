$(function(){



	console.log( navigator.userAgent )
	console.log( navigator )
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

	// Open modal
	$('#chatModal').modal();
	// close modal on enter key
	$('#your_nickname').bind('keydown', function(e){
		if (e.keyCode == 13) {
			$('#select-nickname').trigger('click');
		}
	});
	// Wait for theme to select a name
	$('#select-nickname').click(function(){
		var your_nickname = $('#your_nickname').val();
		$('#chatModal').modal('hide');
		socket.emit('nickname selected', your_nickname );
		$('#client_nickname').val( your_nickname );
		$('#message').focus();
	});
	// Close modal and set name
	$('#chatModal').on('hidden.bs.modal', function () {
		console.log( 'MODAL CLOsED' );
		$('#chatModal').modal('hide');
		if( $('#nickname').length ){
			socket.emit( 'set username', { socket_id: socket.id, new_nickname: $('#nickname').val() });
			$('#user-list').append( '<li class="'+socket.id+'">'+$('#nickname').val()+'</li>' );
		} else {
			var guest_name = 'Guest' + Math.floor(Math.random()*4000);
			$('#user-list').append( '<li class="'+socket.id+'">'+ guest_name +'</li>' );
			socket.emit( 'set username', { socket_id: socket.id, new_nickname: guest_name });
		}
	});


	
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
