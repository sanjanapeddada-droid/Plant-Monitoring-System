// src/utils/socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  autoConnect: true,
  reconnection: true,
  withCredentials: true
});

export default socket;
