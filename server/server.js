const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

// const webpack =require('webpack');
// const webpackConfig = require('./../webpack.config');
// const compiler = webpack(webpackConfig);
// app.use(
//     require('webpack-dev-middleware')(compiler, {
//         noInfo: false,
//         publicPath: webpackConfig.output.publicPath
//     })
// );
// app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static(publicPath));
var users = new Users();

// Normal Socket                                                         :: Using rooms
// _____________________________________________________________________________________________________________________________________________________________
// io.emit :  goes to all users                                          :: io.to(params.room).emit : goes to all users in room
// socket.broadcast.emit : goes to all users except the current socket   :: socket.broadcast.to(params.room).emit : goes to all users except the current socket
// socket.emit // goes to one user                                       :: socket.emit : its the exact same 

io.on('connection', (socket)=>{

     //joinning chat room
    socket.on('join', (params, callback)=>{

        //console.log("connection made", socket.id);
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and room name are required.');
        }        
       
        //create user
        var user = users.getUser(socket.id);
        if(!user){
            users.addUser(socket.id, params.name, params.room, params.avatar);
            user = users.getUser(socket.id); 
        }   

        socket.join(user.room);       

        console.log("update users list ", users.getUsersByRoom(user.room) );

        io.to(user.room).emit('updateUserList', users.getUsersByRoom(user.room))

        io.emit('updateAvailableRooms', users.getAllRooms());  

        socket.on('switchRoom',(params, callback)=>{            
            //leave old room
            //io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room`) )
            socket.leave(user.room);
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room`) )
            //update user room
            user.room = params.room; //change users old room to new room            
            //join new room
            socket.join(user.room);
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has joined the room`) );
            io.to(user.room).emit('updateUserList', users.getUsersByRoom(user.room));        
        
            socket.emit('updateAvailableRooms', users.getAllRooms());   

            //send users in the room
            //socket.emit('updateUserList', users.getUsersByRoom(user.room) );   

            callback();
        });
        callback();
    });

    socket.on('createMessage', (message, callback)=>{
        io.to(message.room).emit('newMessage', generateMessage(message.from, message.text, message.avatar));
        var room = io.sockets.adapter.rooms[message.room]; 
        callback("message processed");        
    });

    socket.on('disconnect', ()=>{
        var user = users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room`) )
            users.removeUser(user.id);
            console.log("user removed", user.id, users );
        }
    });
});

server.listen(port ,()=>{
    console.log(`Server runing on port ${port}`);
    console.log(`all good`);
})





