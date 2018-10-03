import React from 'react';

const Room = (props) =>{
    return(
        <div className="repeatable" onClick={ ()=> props.handleChangeRoom(props.room) }>
            <div className="add-padding v-center">
                <div className="add-padding-left">{props.room}</div>
            </div>
        </div>
    )   
}

export default Room;