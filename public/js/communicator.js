/*jshint esversion: 6 */
function onPlay() {
	var form = document.getElementById("name_form");
	var formData = new FormData(form);
	socketStuff(formData);
	return false;
}

document.getElementById("name_form").onsubmit = onPlay;

function socketStuff(formData) {
	var gameName = formData.get('server');
	var path = '/' + gameName + '/socket.io';
    const socket = io('/', {
        secure: true,
        rejectUnauthorized: false,
        path: path
    });

    socket.on('test1', function(data) {
        console.log('Test1 receieved');
    });

    socket.emit('play_game', formData.get('username'));

}