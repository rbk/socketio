/*
*
* Socket IO
*
*/
// Connection made to socket
io.on('connection', function(socket){

    socket.emit('your socket id', socket.id);

    // Get ALL messages
    // Send all messages to client as object
    Chat.find({ },function (err, messages) {
        if (err) return console.error(err);
        socket.emit('connected', messages);
    });


    // Someone sends a message
    socket.on('chat message', function(data){
        var sanitized_message = sanitizer.escape(data.message);
        var message = new Chat({ name: data.nickname, message: sanitized_message });
        // Save Message to MongoDB
        message.save(function (err) {
            // Handle errors ***
            if( err ){
                io.emit('chat message', 'Something went wrong while saving your message');
            } else {
                // console.log( 'Message saved to MongoDB: ' + msg );
                // Send message to all sockets including yours!
                io.emit('chat message', { nickname: data.nickname, message: sanitized_message });
            }
        });
    });



    socket.on('set username', function(nickname){
        var user = new ChatUser({nickname: sanitizer.escape(nickname), socket_id: socket.id});
        user.save(function(err){
            if( !err ){
                rbk_update_users_list();
                io.emit('user joined', nickname);
            }
        });
    });
    socket.on('disconnect', function( res ){
        var user = ChatUser.find({socket_id:socket.id}, function(err,user){
            // console.log( user )
            if( !err && user[0] ){
                io.emit('user left', user[0].nickname);
                ChatUser.remove({socket_id: socket.id}, function(err){
                    rbk_update_users_list();
                });
            } else {
                console.log( 'didn\'t find user' );
            }
        });
    });

    function rbk_update_users_list(  ){
        ChatUser.find({ },function (err, users) {
            if( !err ){
                io.emit( 'update user list', users);
            }
        });
    }



    // Broadcast your mouse position!
    socket.on('mouse_position', function(pos){
        pos.id = socket.id;
        io.emit('show_mouse', pos);
    });
    // Remove your mouse icon when you disconnect
    socket.on('disconnect', function( res ){
        socket.broadcast.emit('remove_cursor', socket.id );
        // socket.emit('remove user', socket.id );
    });


}); // end io connect