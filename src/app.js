import React from 'react';
import ReactDOM from 'react-dom';
import ChatApp from './components/ChatApp';
import 'normalize.css/normalize.css/';
import './styles/styles.scss';
import IO from 'socket.io-client';
const socket = IO();

ReactDOM.render(<ChatApp socket={socket}/>, document.getElementById('chatapp'));


