const socket = io('/', {
  secure: true,
  rejectUnauthorized: false,
  path: '/game1/socket.io'
});

socket.on('test1', function(data) {
	console.log('Test1 receieved');
});

socket.emit('play_game', 'I WANNA PLAY');