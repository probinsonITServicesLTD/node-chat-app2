import React from 'react';
import Room from './Room';

const OtherRooms = (props) =>{
    return(
        <div className="other-rooms add-borders">
            <div className="repeatable-title"><span>Other Rooms</span></div>
            {
                props.rooms.map((room, i)=> {
                    //filter out current room user is in
                    if(!!props.myroom && props.myroom != room){
                        return <Room key={i} 
                                    room={room} 
                                    handleChangeRoom={props.handleChangeRoom }
                                />
                    }
                })
            }
        </div>
    )     
}

export default OtherRooms;