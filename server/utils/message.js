var generateMessage = (from, text, avatar)=>{
    if(!avatar){
        avatar="";
    }
    return {
        from : from,
        text : text,
        avatar : avatar,
        createdAt : new Date().getTime()
    }
}

module.exports = {generateMessage};