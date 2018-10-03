import React from 'react';

const User = (props) =>{
    return(
        <div className="repeatable">
            <div className="add-padding v-center" style={{display:'flex'}}>
                <div className="img-container add-padding-left">
                    <img src={'images/'+props.user.avatar+'.png'} height="30" />
                </div>
                <div className="add-padding-left">{props.user.name}</div>
            </div>
        </div>
    )   
}

export default User;