process.on('message', function(message, socket) {
    socket.on('data', function(data) {
        // really poor echo ... :)
        socket.write(data);
        console.log("uwu");
    });
});