const express = require('express');
const app = express();
const server = require('http').Server(app);

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

server.listen(2000, () => {
    console.log('Server started at localhost:2000');
});

const activeConnections = {};
const io = require('socket.io')(server, {});

io.sockets.on('connection', socket => {
    console.log('User connected to server.');

    socket.id = Math.random();
    activeConnections[socket.id] = socket;

    socket.on('disconnect', () => {
        delete activeConnections[socket.id];
    });

    socket.on('error', () => {
        console.log('Communication Error.');
    });

    socket.on('sendMessage', data => {
        for(let i in activeConnections) {
            activeConnections[i].emit('receiveMessage', data);
        }
    });
});