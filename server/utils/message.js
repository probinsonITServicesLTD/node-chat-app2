moment = require('moment');

var generateMessage = (from, text, avatar, socketId)=>{
    if(!avatar){
        avatar="";
    }
    return {
        from, 
        text, 
        avatar, 
        createdAt : new moment().format('DD MMM YYYY hh:mma')
    }
}

module.exports = {generateMessage};