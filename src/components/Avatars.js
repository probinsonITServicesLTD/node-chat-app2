import React from 'react';
import ModalWindow from './ModalWindow';

class Avatars extends React.Component{
    render(){
        return(
            <div className="pad-left">
                <ModalWindow 
                    showchatapp={this.props.showchatapp}
                    avatars={this.props.avatars}
                    handleSelectAvatar={this.props.handleSelectAvatar}
                >
                </ModalWindow>
            </div>
        )
    }


}

export default Avatars;