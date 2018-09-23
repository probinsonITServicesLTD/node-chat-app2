const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const {Room, AllRooms} = require('./utils/rooms');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
var allRooms = new AllRooms();



app.use(express.static(publicPath));

// Normal Socket                                                         :: Using rooms
// _____________________________________________________________________________________________________________________________________________________________
// io.emit :  goes to all users                                          :: io.to(params.room).emit : goes to all users in room
// socket.broadcast.emit : goes to all users except the current socket   :: socket.broadcast.to(params.room).emit : goes to all users except the current socket
// socket.emit // goes to one user                                       :: socket.emit : its the exact same 

io.on('connection', (socket)=>{


    //joinning chat room
    socket.on('join', (params, callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and room name are required.');
        }

        //need to push room avatars here
        var room = allRooms.findRoom(params.room);
        //console.log("room found", room);
        
        //create user
        var user = users.getUser(socket.id);
        if(!user){
            users.addUser(socket.id, params.name, params.room);
            user = users.getUser(socket.id);
            //console.log("user created");
        } else {
            //console.log("user exists");
        }
        
        
        if(!room){
            room = new Room(params.room, JSON.stringify(users));            
            io.to(params.room).emit('newMessage', generateMessage('Admin', `Welcome to the ${user.room} chat room`));
            allRooms.addRoom(room);           
            
            //send out list of rooms to all users
            //console.log("new room created", room.getName());
        } 


        socket.join(room.getName());
        room.addUserToRoom(user);

        //console.log("room found", room);
   

        socket.on('switchRoom',(params, callback)=>{

            //console.log("Switch rooms", user, params.room);

            //dont touch below, its all works
            var oldRoom = allRooms.findRoom(user.room);
            oldRoom.removeUserFromRoom(user.id);       
            room.addUserToRoom(user);
            
            //leave old room
            socket.leave(user.room);

            //update user room
            user.room = params.room; //change users old room to new room                

            //join new room
            socket.join(user.room);

            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has joined the room`) )
            socket.emit('roomHasChanged', {
                room : params.room
            });
            
            
            //send room avatars
            socket.emit('showAvailableAvatars', {
                chars : room.getAvatars()
            });
            //deleteRoomifEmpty(oldRoom, allRooms, io);
            socket.emit('updateAvailableRooms', allRooms.getRoomsNames() );
            
            callback();
        });
        
 

        //check if user name already in use in group
        if(room.getUserNames().includes(params.name)){
            //return callback(`Thats name already in use in the room ${room.getName()}, please select another name.`);
        } else {
            //need to create a user first with generic avatar
            //users.addUser(socket.id, params.name, params.room);
        }

        //send avatars 
        socket.emit('showAvailableAvatars', {
            chars : room.getAvatars()
        });

        io.emit('updateAvailableRooms', allRooms.getRoomsNames() );

        socket.on('avatarSelected', (avatar)=>{ 
            room.updateUserAvatar(avatar.name, user.id, function(err){
                if(err){
                    //avatar not available
                    callback("avatar not available");
                    //send avatars 
                    socket.emit('showAvailableAvatars', {
                        error: "Avatar no longer available, please select another.",
                        chars : room.getAvatars()
                    });
                } else {
                    io.to(user.room).emit('updateUserList', room.getUserList());
                }
            });            
        });

        callback();
    });

    socket.on('createMessage', (message, callback)=>{
        var user = users.getUser(socket.id);
        //var room = allRooms.findRoom(user.room);

        //console.log("createMessage", user.room);
        if(user){
            //console.log(room.getUserList());
            io.to(user.room).emit('newMessage', generateMessage(message.from, message.text, user.avatar));
            //console.log('message sent to room', user.room);
            var room = io.sockets.adapter.rooms[user.room];
            //console.log(room);
        }
        //io.emit('newMessage', generateMessage(message.from, message.text, users.getUser(socket.id).avatar));

        callback("message processed");        
    });

    socket.on('disconnect', ()=>{
        var user = users.getUser(socket.id);
        if(user){
            var room = allRooms.findRoom(user.room);
            if(room){
                //BELOW NEEEDS TO BE TESTED
                room.removeUserFromRoom(user.id);
                //console.log("Checking if "+ room.getName() + " is empty");
                //if(room.getUserList().length <=0){
                    //delete room
                    //console.log( room.getName() + " room deleted");
                    //delete io.sockets.adapter.rooms[room.getName()];
                    //allRooms.removeRoom( room.getName() );
                    //io.emit('roomsList', allRooms.getRoomsNames() );
                //} else {
                    //only broadcast if room has user
                    //io.to(user.room).emit('updateUserList', room.getUserList());
                //}
            }
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room`) )
        }
    });



});

const deleteRoomifEmpty = (room, allRooms, io)=>{
    console.log( room.getName() + " room deleted");
    delete io.sockets.adapter.rooms[room.getName()];
    allRooms.removeRoom( room.getName() );
    io.emit('updateAvailableRooms', allRooms.getRoomsNames() );
}

server.listen(port ,()=>{
    console.log(`Server runing on port ${port}`);
})

module.exports = {
    io, 
    app,
    server,
    port,
    users
}



//lesson 113 sockets -13.50


