const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log('New user connected ', socket.id);

    socket.on('disconnect', (socket)=>{
        console.log('Client disconnected ', socket.id);
    });

    socket.emit('newMessage', {
        from: "steve@exmaple.com",
        text: "what up"
    });


    socket.on('createMessage', (message)=>{
        console.log('Create message', message);
    });


});



server.listen(port ,()=>{
    console.log(`Server runing on port ${port}`);
})

//finish module 106 in 09 Real time ....., stopped at 14.11
