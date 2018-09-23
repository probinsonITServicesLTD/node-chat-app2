var socket = io();
var me ="";
var params;
var currentChatRoom = "";


$(document).ready(function(){
    params = $.deparam(window.location.search);    
})

//sockets events

socket.on('connect', function(){
    params = $.deparam(window.location.search);
    me = params.name;
    currentChatRoom = params.room;
    socket.emit('join', params, function(err){
        if(err){
            alert(err);
            window.location.href = '/index.html';            
        } else {
            //console.log("chat room is", currentChatRoom);
            $('#room-name').text(currentChatRoom);
        }
    })
});

socket.on('disconnect', function(){
    console.log("disconencted from server");
});

socket.on('updateAvailableRooms',(rooms)=>{
    var html = "";
    //console.log(rooms);
    rooms.forEach(function(name){
        if(name != currentChatRoom ){
            html += roomListTemplate(name);
        }
    });

    $('#rooms-list').html(html);
    //console.log('updateAvailableRooms');
});

socket.on('roomHasChanged',(newRoom)=>{
    currentChatRoom = newRoom.room;
    //console.log('roomHasChanged');
});




socket.on('showAvailableAvatars', function(charAvators){
    //$("#user-list").html('');
    //check if error object included in response i.e already in use
    if(charAvators.error){
        $('#avatars-errors').text(charAvators.error);
    } else {
        $('#avatars-errors').text('');
    }
    $("#container").css('display', 'none');
    $("#avatars-list").html('');
    $("#select-avatar").css('display', 'block');
    //console.log("avatars sent from server", charAvators);
    $(charAvators.chars).each(function(index, name){
        try{
            $('#avatars-list').append(`<img src='images/${name}.png' style='cursor: pointer' height='80' onclick="selectAvatar('${name}')" />`);
        }catch(err){
            //console.log("error with ", name);
        }
    });   
    //console.log('showAvailableAvatars') ;
})


socket.on('newMessage', function(message){
    //console.log("new message", message);
    $('#messages').append( userMessageTemplate(message) );
    $('#messages').stop().animate({
        scrollTop: $("#messages")[0].scrollHeight
      }, 1200);
});

socket.on('updateUserList', (users)=>{
    //console.log('Users list', users);
    var html = "";
    userListTemplate
    users.forEach(function(user){
        html +=  userListTemplate(user);
    });

    $('#user-list').html(html);

})


//functions

function selectAvatar(name){
    //console.log(name);
    socket.emit('avatarSelected', {
        name
    });
    $("#select-avatar").css('display', 'none');
    $("#container").css('display', 'block');
}


function formatDate(d){
    function str_pad(n) {
        return String("00" + n).slice(-2);
    }
    return "(" + str_pad(d.getDate()) + "/" + str_pad(d.getMonth()+1) + "/" + d.getFullYear() + " " + d.getHours()+":" + d.getMinutes() +")";
}

function stripHTML(str){
    var strippedText = $("<div/>").html(str).text();
    return strippedText;
}

//event handlers

$('#message').on('keydown', function(e){
    //e.preventDefault();
    if(e.which == 13 && $.trim(  $("#message").val())) {
        socket.emit('createMessage', {from: 'paul', text:  stripHTML($('#message').val())}, function(res){
            //console.log("Server",res);
            $("#message").val("");  
        });
    }
});

//change room

function changeRoom(newRoomName){
    var params = {
        name : me,
        room : newRoomName
    }
    //check if already in room
    if(currentChatRoom !== params.room  ){
        socket.emit('switchRoom', params, function(err){
            if(err){
                //roomm was not changed

            } else {
                //update local vars
                me = params.name;
                currentChatRoom = params.room;
                $('#room-name').text(currentChatRoom);
                //select avatar
                $("#container").css('display', 'none');
            }
        });   
    };

}

//templates
function userMessageTemplate(message){
    var alias = "";
    //console.log(me + " "+ message.from)
    if(message.from === me){
        alias = " (me)";
    } else {
        alias = message.from;
    }

    if(message.from === 'Admin'){
        return `
            <div class="admin-message" style="background-color:gray;padding-left:15px;color:white">
                <p>${message.text}</p>              
            </div>
        `
    } else{
        //normal message
        return `
            <div class="chat-element" style="display:flex">
                <div class="avatar flex-pos" style="height:100px">
                    <img src="images/${message.avatar}.png" height="100"/>
                </div>
                <div class="flex-pos chat-text" style="width:537px">
                    <p style="word-wrap: break-word;padding:3px;text-align:left"><span style="font-weight:bold">${alias}:</span> ${message.text} <br/><br/><span style="font-size:.8em">${message.createdAt}<span></p>       
                </div>    
            </div>
        `
    }
}

function userListTemplate(user){  
    var alias = "";
    if(user.name === me){
        alias = " (me)";
    } else {
        alias = user.name;
    }
    
    return `
        <div class="user">
            <img src="images/${user.avatar}.png" height="60"/>
            <div style="display:table-cell;vertical-align:middle; width:100%">
                <span style="padding:15px">${user.name}${alias}</span>
            </div>
        </div>  
    `
}

function roomListTemplate(name){
    return `
        <div class="room-name" data-room-name="${name}" onclick="changeRoom('${name}')">
            <span style="font-weight:bold">Name : </span><span>${name}</span>
        </div>
    `
}