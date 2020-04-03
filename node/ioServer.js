var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const expressStatusMonitor = require('express-status-monitor');
app.use(expressStatusMonitor({
  websocket: io,
  port: app.get('port')
}));

io.on('connection', function(socket) {
    console.log("little bitch you are");
});

http.listen(2999, function() {
    console.log('listening on localhost:2999');
});
