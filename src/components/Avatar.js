import React from 'react';

const Avatar = (props)=>{
    return(
        <div>
            <img 
                src={'images/'+props.avatar+'.png'} 
                height='80' 
                onClick={ () => props.handleSelectAvatar(props.avatar) }            
            />
        </div>
    )    
}

export default Avatar;