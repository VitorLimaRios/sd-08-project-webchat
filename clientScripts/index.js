/* eslint-disable import/extensions */
import nicknameHandler from './nickname.js';
import messageHandler from './message.js';

const { io } = window;

const socket = io();

nicknameHandler(socket);
messageHandler(socket);

export default socket;