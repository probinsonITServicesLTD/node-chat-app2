var connectedClients = {};
var charAvatars = ['stan', 'kyle', 'wendy', 'craig', 'butters', 'kenny', 'eric', 'randy'];



const addAvatar = (socketId, avatarName)=>{
    //only allow one avatar
    return new Promise((resolve, reject)=>{
        if(!connectedClients[socketId]){
            var index = charAvatars.indexOf(avatarName);
            if (index > -1) {
                charAvatars.splice(index, 1);
                connectedClients[socketId] = {
                    avatar : avatarName
                }
                resolve(avatarName);
            }   
        } else {
            reject();
        }
    });

}

const removeAvatar = (socketId, avatarName, callback)=>{
    if(connectedClients[socketId]){
        charAvatars.push(avatarName);
        callback("Added", avatarName, "into pool");
    } else {
        callback("not found");
    }

}

module.exports = {
    addAvatar,
    charAvatars,
    removeAvatar,
    connectedClients
}