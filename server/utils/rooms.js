const {Users} = require('./users');
var users = new Users();

class AllRooms{
    constructor(){
        this.allRooms = [];
    }

    addRoom(roomName){
        this.allRooms.push(roomName);
    }

    removeRoom(name){
        this.allRooms = this.allRooms.filter((room) => room.getName() !== name);
    }

    getUsersInRoom(roomName){
        var room = this.allRooms.filter((room)=>room.getName() === roomName)[0]

        if(room){
            return room.getUserList();
        }
    }

    getRoomsNames(){
        return this.allRooms.map((room)=>room.getName());
    }    

    findRoom(roomName){
        var room = this.allRooms.filter((room)=>room.getName() === roomName ); 
        if(room){
            return room[0];
        } 
    };
        
};






class Room{
    constructor(name, users){
        this.allUsers = users;
        this.name = name;
        this.charAvatars = ['stan', 'kyle', 'wendy', 'craig', 'butters', 'kenny', 'eric', 'randy'];
        this.roomUsers = [];
    }

    getName(){
        return this.name;
    }

    findObjectByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return array[i];
            }
        }
        return null;
    }

    updateUserAvatar(avatar, id, callback){
        var user = this.roomUsers.filter((user)=>user.id===id)[0];
        if(user){
            //check if avatar still available
            var index = this.charAvatars.indexOf(avatar);
            if(index === -1){
                console.log("avatar no longer available");
                callback("avatar no longer available.");
            } else {
                user.avatar = avatar;
                console.log("avatar updated", user);
                this.removeAvatarFromPool(avatar);
            }
        }
        callback();
    }


    removeAvatarFromPool(avatar){
        var index = this.charAvatars.indexOf(avatar);
        if (index > -1) {
            this.charAvatars.splice(index, 1);
            //console.log("remove "+avatar +" from pool", this.charAvatars);
        } 
        return avatar; 
    };


    getAvatars(){
        return this.charAvatars;
    };

    putAvatarBackInPool(avatar){
        var inArray = this.charAvatars.includes(avatar);
        if (!inArray){
            this.charAvatars.push(avatar);
            return true;
        }
        return false;
    };

    addUserToRoom(user){ 
        this.roomUsers.push(user);   
    };

    removeUserFromRoom(id){
        //must reclaim avatar
        console.log('REMOVING USER', id);

        var user = this.roomUsers.filter((user)=>user.id===id)[0];

        //recover avatar
        if(user){
            if(user.avatar !='generic'){
                this.putAvatarBackInPool(user.avatar);
                console.log(user.avatar + ' removed from ', user.name + ' and added to pool');
                user.avatar = "generic";
            }
        }

        //remove user from room
        var index = this.roomUsers.indexOf(user);
        console.log("index", index);
        if (index > -1) {
            this.roomUsers.splice(index, 1);
            console.log(user.name + " removed from room" + user.room);
        } 
    }

    getUserList(){
        //console.log("getUserList",this.roomUsers);
        return this.roomUsers;
    }

    getUserNames(){
        return this.roomUsers.map((user)=>user.name);
    }

}    
 

module.exports = {
    Room,
    AllRooms
}