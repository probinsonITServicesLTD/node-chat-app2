const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const {addAvatar, removeAvatar, charAvatars, connectedClients} = require('./utils/avatar');

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

//var connectedClients = {};
//var charAvatars = ['stan', 'kyle', 'wendy', 'craig', 'butters', 'kenny', 'eric'];

io.on('connection', (socket)=>{
    var getRefToSockID = socket.id;
    var avatar;
    var selectAvatar = false;

    socket.emit('avatarMessage', {
        chars : charAvatars
    })

    socket.on('avatarSelected', (avatar)=>{
        //console.log("Client selected", avatar.name);       
        addAvatar(socket.id, avatar.name)
            .then((name)=>{
                avatar = name;
                selectAvatar = true;
                console.log(connectedClients[getRefToSockID].avatar);
                socket.emit('adminMessage',generateMessage('Admin', 'Your selected avatar is '+connectedClients[getRefToSockID].avatar + '.  You can begin chatting now.'));

            }).catch((err)=>{
                console.log("error occured");
            })
    });

    //socket.emit('adminMessage', generateMessage('Admin', 'Welcome to the chat app!'))

    socket.broadcast.emit('adminMessage',generateMessage('Admin', ' A new User has joined'));

    socket.on('createMessage', (message, callback)=>{
        if(selectAvatar){
            io.emit('newMessage', generateMessage(message.from, message.text, connectedClients[socket.id].avatar));
        }
        callback("message processed");
        
    });

    socket.on('disconnect', ()=>{
        if(connectedClients[getRefToSockID]){
            removeAvatar(getRefToSockID, connectedClients[getRefToSockID].avatar,()=>{
                console.log(connectedClients[getRefToSockID].avatar, "added back into pool")
            });
            delete connectedClients[getRefToSockID];
        }

    });



});

server.listen(port ,()=>{
    console.log(`Server runing on port ${port}`);
})

module.exports = {
    io, 
    app,
    server,
    port
}


//lesson 113 sockets -13.50


