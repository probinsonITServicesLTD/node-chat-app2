import React from 'react';

const RoomName = (props) =>{
    return(
        <div className="room-name add-bottom-margin add-borders">
            <span>Room Name: {props.roomname}</span>   
        </div>
    )   
}

export default RoomName;