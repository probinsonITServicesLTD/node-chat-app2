class Users{
    constructor(){
        this.users = [];
    }

    getAllRooms(){
        return [...new Set(this.users.map(user => user.room))];
    }

    getUsersByRoom(room){
        var roomUsers =  this.users.filter((user) => user.room === room);
        return roomUsers;
    }

    addUser(id, name, room, avatar){
        var user = {id, name, room, avatar};
        this.users.push(user);
        return user;
    }

    removeUser(id){
        //returns user that was removed
        var user = this.getUser(id);
        if(user){
            this.users = this.users.filter((user)=>user.id !==id ); 
        }
        return user;
    }

    getUser(id){
        return this.users.filter((user)=>user.id ===id)[0];
    }

}

module.exports = {
    Users
}