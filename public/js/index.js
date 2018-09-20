var socket = io();


socket.on('connect', function(){
    console.log("connected to server");
});

socket.on('disconnect', function(){
    console.log("disconencted from server");
});

socket.on('avatarMessage', function(charAvators){
    console.log(charAvators);
    $(charAvators.chars).each(function(index, name){
        try{
            $('#select-avatar').append(`<img src='images/${name}.png' height='80' onclick="selectAvatar('${name}')" />`);
        }catch(err){
            console.log("error with ", name);
        }

    })
})

function selectAvatar(name){
    console.log(name);
    socket.emit('avatarSelected', {
        name
    });
    $("#select-avatar").css('display', 'none');
    $("#message-form").css('display', 'block');
    $("#messages-container").css('display', 'block');
}

socket.on('newMessage', function(message){
    console.log("new message", message);
    $('#messages').append( userMessageTemplate(message.from, message.text, message.avatar) );
});

socket.on('adminMessage', function(message){
    $('#messages').append( adminMessageTemplate(message.from, message.text) );
})


$('#message').on('keydown', function(e){
    //e.preventDefault();
    if(e.which == 13 && $.trim($("#message").val())) {
        socket.emit('createMessage', {from: 'User', text: $('#message').val()}, function(res){
            console.log(res);
            $("#message").val("");
    
            $('#messages').stop().animate({
                scrollTop: $("#messages")[0].scrollHeight
              }, 1200);
        });
    }

})


//auto scroll
$(document).ready(function(){
   
})


//my code

function userMessageTemplate(from, message, avatar){
    return `
        <div class="container" style="display:flex">
            <div class="avatar flex-pos" style="height:100px">
                <img src="images/${avatar}.png" height="100"/>
            </div>
            <div class="flex-pos chat-text" style="width:537px">
                <p>${message} <br/><br/><span style="font-size:.8em">${formatDate(new Date())}<span></p>       
            </div>    
        </div>
  `
}

function adminMessageTemplate(from, message){
    return `
        <div class="admin-message" style="background-color:gray;padding-left:15px;color:white">
            <p>${message}</p>              
        </div>
  `
}

function formatDate(d){
    function str_pad(n) {
        return String("00" + n).slice(-2);
    }
    return "(" + str_pad(d.getDate()) + "/" + str_pad(d.getMonth()+1) + "/" + d.getFullYear() + " " + d.getHours()+":" + d.getMinutes() +")";
}