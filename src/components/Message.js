import React from 'react';

const Message  = (props)=>{    
    
    if(props.message.from === 'Admin'){
       return(
            <div className="message">
                <p>{props.message.text}</p>
            </div>
       )
    } else {
        return(
            <div className="message">
                <div className="avatar flex-pos">
                    <img src={'images/'+ props.message.avatar +'.png'}/>
                </div>
                <div className="flex-pos chat-text">
                    <p className="message-text">
                        <span> {props.message.text} </span><br/><br/>
                        <span>{props.message.createdAt}</span>
                    </p>       
                </div>    
            </div>
        )
    }
  
}

export default Message;

