var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
nicknames = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.sockets.on('connection', function(socket){
    socket.on('new user', function(data, callback){
        if (nicknames.indexOf(data) != -1) {
            callback(false);
        } else {
            callback(true);
            socket.nickname = data;
            nicknames.push(socket.nickname);
            updateNicknames();
        }
    });

    function updateNicknames() {
            io.sockets.emit("usernames", nicknames);
    }

    socket.on('send message', function(data){
            io.sockets.emit('new message', {msg: data, nick: socket.nickname});
    });

    socket.on('disconnect', function(data){
            if (!socket.nickname) return;
            nicknames.splice(nicknames.indexOf(socket.nickname), 1);
            updateNicknames();
    });
});
