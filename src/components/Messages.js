import React from 'react';
import Message from './Message';

export default class Messages extends React.Component{
      
    state = {
        messages: [], 
        message:''
    }

    handleChange = (e)=>{
        this.setState({
            message : e.target.value
        });
        e.preventDefault();
    };

    handleKeyPress = (e) =>{
        if(e.keyCode == 13 && e.target.value.trim() ){           
            let message={
                from: this.props.username, 
                text:  e.target.value, 
                avatar: this.props.avatar, 
                room: this.props.myroom
            }
            this.props.socket.emit('createMessage', message, (res)=>{
                if(res){
                    //message was processed
                    this.setState({
                        message : ''
                    });
                }
            });            
        };
    };
    
    componentDidMount() {
        this.props.socket.on('newMessage', (message)=>{                      
            this.setState((previousState)=>{
                return {
                    messages : previousState.messages.concat(message)
                }                
            })            
        });
    }

    componentDidUpdate(){
        this.scrollToBottom();
    }

    scrollToBottom=()=>{
        const scrollHeight = this.messages.scrollHeight;
        const height = this.messages.clientHeight;
        const maxScrollTop = scrollHeight - height;
        this.messages.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }

    render(){
        return(
            <div className="messages">
                <div className="add-borders add-bottom-margin messages-window" ref={(div) => this.messages = div}>
                {
                    this.state.messages.map((message, i)=>
                    <Message 
                        key={i} message={message}
                    />)
                }
                </div>
                <div className="add-borders user-input-parent">
                    <textarea 
                        type="text" 
                        className="user-input" 
                        id="message" 
                        placeholder="Type message and press Enter to send" 
                        resize="none"
                        onKeyDown={this.handleKeyPress}
                        username={this.props.username}
                        avatar={this.props.avatar}
                        value={this.state.message}
                        onChange={this.handleChange}                      
                >
                </textarea>
                </div>

            </div>
        )
    }
}