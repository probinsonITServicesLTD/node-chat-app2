import React from 'react';
import Modal from 'react-modal';
import Avatar from './Avatar';

const ModalWindow = (props) => (
    <Modal
        isOpen={!props.showchatapp}
        className="Modal"
        overlayClassName="Overlay"
    >
        <h2 style={{textAlign:'center'}}>Please select an avatar before proceeding.</h2>
        <div className="flex-float-img" style={{textAlign:'center'}}> 
        {
            props.avatars.map((avatar, i)=><Avatar key={i} avatar={avatar} handleSelectAvatar={props.handleSelectAvatar }/>)
        }
        </div>

    </Modal>
);

export default ModalWindow;


