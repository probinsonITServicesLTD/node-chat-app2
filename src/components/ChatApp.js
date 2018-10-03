import React from 'react';
import Header from './Header';
import Avatars from './Avatars';
import Messages from './Messages';
import RoomName from './RoomName';
import OtherUsers from './OtherUsers';
import OtherRooms from './OtherRooms';

export default class ChatApp extends React.Component{    

    state = {
        headerTitle : "Welcome to the Chat App",
        avatars : ['stan', 'kyle', 'wendy', 'craig', 'butters', 'kenny', 'eric', 'randy'],
        showchatapp : false,
        name: undefined,
        avatar: undefined,
        userName: undefined,
        room: undefined,
        rooms : [],
        users: [],
        params: jQuery.deparam(window.location.search),
        mySocketId: undefined
    }


    componentDidMount=()=>{
        this.props.socket.on('connect', ()=>{          
            this.setState(()=>{
                return({
                    userName: this.state.params.name,
                    room: this.state.params.room
                })
            })
        })
        this.props.socket.on('updateAvailableRooms', (otherRooms)=>{
            this.setState((previousState)=>{
                return{
                    rooms: otherRooms
                }
            })
        })

        this.props.socket.on('updateUserList', (users)=>{
            this.setState((previousState)=>{
                return{
                    users: users
                }
            })     
        })

    }

    handleSelectAvatar=(name)=>{
        this.setState(()=>{
            return({
                showchatapp: true,
                avatar: name
            })
        })  
        let params = this.state.params;
        params.avatar = name;
        this.props.socket.emit('join', params, (err)=> {                
            if (err) {
              alert(err);
              window.location.href = '/';
            } else {
                this.setState(()=>{
                    return({
                        mySocketId: this.props.socket.id     
                    })
                })  
            }
        })         
    }

    handleChangeRoom=(room)=>{
        let params={
            name: this.state.name,
            room: room
        }
        this.props.socket.emit('switchRoom', params, (err)=>{
            if(err){

            } else {
                this.setState(()=>{
                    return({
                        room: room
                    })
                })
            }
        })
    }

    render(){
        return(
            <div>
                <Header title={this.state.headerTitle}/>
                <div className="row">
                    <div className="column" style={{display: this.state.showchatapp? 'flex': 'none'}}>
                        <RoomName 
                            roomname={this.state.room}                
                        />

                        <Messages 
                            username={this.state.userName}
                            avatar={this.state.avatar}
                            socket={this.props.socket}   
                            myroom={this.state.room}                
                        />
                    </div>
                    <div className="column" style={{display: this.state.showchatapp? 'flex': 'none'}}>
                        <OtherUsers 
                            users={this.state.users}
                            me={this.state.name}
                        />                    
                        <OtherRooms
                            rooms={this.state.rooms}
                            handleChangeRoom={this.handleChangeRoom}
                            myroom={this.state.room}
                        />
                    </div>
                    <Avatars 
                        handleSelectAvatar={this.handleSelectAvatar}
                        avatars={this.state.avatars}
                        username={this.state.userName}
                        showchatapp={this.state.showchatapp}
                    />
                </div>
            </div>
        );
    }
}


