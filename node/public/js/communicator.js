var mainSocket = io();
var socket;

mainSocket.on('join_room_success', function(data) {
	console.log('Joined room: ' + data);

	socket = io('/G_' + data.toString());

	socket.on('test1', function(data) {
		console.log('This should run when server msg');
		console.log('server msg: ' + data);
	});

	socket.emit('data', 'hehe big boy test!!!');

});
mainSocket.on('test1', function(data) {
	console.log('THIS SHOULD NEVER RUN');
});


//Test
mainSocket.emit('play_game', 'I WANNA PLAY');