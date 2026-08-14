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
const COLORS = ['#ef4444','#3b82f6','#22c55e','#eab308','#a855f7','#f97316','#ec4899','#06b6d4'];
const ALLOWED_ACTIONS = new Set(['roll', 'answerQuestion', 'answerChallenge', 'useCard', 'concludeChaos']);

app.get('/health', (_req, res) => res.json({ ok: true, rooms: rooms.size }));

function code() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let value;
  do {
    value = '';
    for (let i = 0; i < 5; i++) value += chars[Math.floor(Math.random() * chars.length)];
  } while (rooms.has(value));
  return value;
}

function roomInfo(room) {
  return {
    code: room.code,
    started: room.started,
    hostId: room.hostId,
    players: room.players.map(player => ({
      id: player.id,
      name: player.name,
      index: player.index,
      color: player.color
    }))
  };
}

function broadcastRoom(room) {
  io.to(room.code).emit('roomUpdate', roomInfo(room));
}

function getRoom(socket) {
  return socket.data.room ? rooms.get(socket.data.room) : null;
}

io.on('connection', socket => {
  socket.on('createRoom', ({ name } = {}) => {
    if (socket.data.room) return socket.emit('errorMessage', 'Você já está em uma sala.');

    name = String(name || 'Jogador 1').trim().slice(0, 20) || 'Jogador 1';
    const roomCode = code();
    const room = {
      code: roomCode,
      hostId: socket.id,
      started: false,
      players: [{ id: socket.id, name, index: 0, color: COLORS[0] }],
      state: null
    };

    rooms.set(roomCode, room);
    socket.join(roomCode);
    socket.data.room = roomCode;
    socket.data.index = 0;

    socket.emit('roomCreated', roomInfo(room));
    broadcastRoom(room);
  });

  socket.on('joinRoom', ({ roomCode, name } = {}) => {
    if (socket.data.room) return socket.emit('errorMessage', 'Você já está em uma sala.');

    const normalizedCode = String(roomCode || '').trim().toUpperCase();
    const room = rooms.get(normalizedCode);

    if (!room) return socket.emit('errorMessage', 'Sala não encontrada.');
    if (room.started) return socket.emit('errorMessage', 'A partida já começou.');
    if (room.players.length >= 8) return socket.emit('errorMessage', 'Sala cheia.');

    name = String(name || 'Jogador').trim().slice(0, 20) || `Jogador ${room.players.length + 1}`;
    const index = room.players.length;

    room.players.push({ id: socket.id, name, index, color: COLORS[index] });
    socket.join(normalizedCode);
    socket.data.room = normalizedCode;
    socket.data.index = index;

    socket.emit('roomJoined', roomInfo(room));
    broadcastRoom(room);
  });

  socket.on('startGame', () => {
    const room = getRoom(socket);
    if (!room || room.hostId !== socket.id) return;
    if (room.started) return;
    if (room.players.length < 2) {
      return socket.emit('errorMessage', 'Entre com pelo menos 2 jogadores.');
    }

    room.started = true;
    room.state = { jogadorAtual: 0, partidaTerminou: false };
    io.to(room.code).emit('gameStarted', { players: roomInfo(room).players });
  });

  socket.on('playerAction', action => {
    const room = getRoom(socket);
    if (!room || !room.started) return;
    if (!action || typeof action.type !== 'string' || !ALLOWED_ACTIONS.has(action.type)) return;

    const playerIndex = Number(socket.data.index);
    const currentPlayer = Number(room.state?.jogadorAtual);

    if (!Number.isInteger(playerIndex) || playerIndex < 0 || playerIndex >= room.players.length) return;
    if (!Number.isInteger(currentPlayer) || currentPlayer < 0 || currentPlayer >= room.players.length) {
      return socket.emit('errorMessage', 'Aguarde a sincronização da partida.');
    }
    if (currentPlayer !== playerIndex) {
      return socket.emit('errorMessage', 'Não é a sua vez de jogar!');
    }

    io.to(room.hostId).emit('remoteAction', {
      type: action.type,
      index: Number.isInteger(Number(action.index)) ? Number(action.index) : undefined,
      playerId: socket.id,
      playerIndex
    });
  });

  socket.on('publishState', state => {
    const room = getRoom(socket);
    if (!room || room.hostId !== socket.id || !room.started) return;
    if (!state || !Array.isArray(state.players)) return;

    room.state = {
      jogadorAtual: Number.isInteger(Number(state.jogadorAtual)) ? Number(state.jogadorAtual) : 0,
      partidaTerminou: !!state.partidaTerminou
    };

    socket.to(room.code).emit('stateUpdate', state);
  });

  socket.on('disconnect', () => {
    const room = getRoom(socket);
    if (!room) return;

    if (room.hostId === socket.id) {
      io.to(room.code).emit('hostDisconnected');
      rooms.delete(room.code);
      return;
    }

    room.players = room.players.filter(player => player.id !== socket.id);
    room.players.forEach((player, index) => {
      player.index = index;
      const member = io.sockets.sockets.get(player.id);
      if (member) member.data.index = index;
    });

    if (room.players.length === 0) {
      rooms.delete(room.code);
      return;
    }

    if (room.state && room.players.length > 0) {
      const current = Number(room.state.jogadorAtual);
      room.state.jogadorAtual = Math.max(0, Math.min(current, room.players.length - 1));
    }

    broadcastRoom(room);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Desafio Total Online: http://localhost:${PORT}`));
