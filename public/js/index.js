var socket = io();

socket.on('connect', function(){
    console.log("connected to server");

    socket.emit('createMessage',{
        from: 'jen@exmaple.com',
        text: 'text of email'
    });
});

socket.on('disconnect', function(){
    console.log("disconencted from server");
});

socket.on('newMessage', function(message){
    console.log("new message", message);
});