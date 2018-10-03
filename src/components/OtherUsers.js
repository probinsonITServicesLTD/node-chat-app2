import React from 'react';
import User from './User'

const OtherUsers = (props) =>{
    return(
        <div className="other-users add-bottom-margin add-borders">
            <div className="repeatable-title"><span>Other Users</span></div>
            {
                props.users.map((user, i)=>
                    <User key={i} 
                        user={user} 
                     />)
            }
        </div>
    )     
}

export default OtherUsers;