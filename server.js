const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
  transports: ['websocket', 'polling']
});

const ROOT = __dirname;
app.use(express.static(ROOT));

const rooms = new Map();
const COLORS = ['#ef4444','#3b82f6','#22c55e','#eab