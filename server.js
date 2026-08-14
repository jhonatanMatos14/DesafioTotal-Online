const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const ROOT = __dirname;
app.use(express.static(ROOT));
app.get('/health', (_req, res) => res.json({ ok: true, rooms: rooms.size }));

const rooms = new Map();
const COLORS = ['#ef4444','#3b82f6','#22c55e','#eab308','#a855f7','#f97316','#ec4899','#06b6d4'];

function code(){
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let c=''; do { c=''; for(let i=0;i<5;i++) c += chars[Math.floor(Math.random()*chars.length)]; } while(rooms.has(c));
  return c;
}
function roomInfo(room){
  return { code: room.code, started: room.started, hostId: room.hostId, players: room.players.map(p=>({id:p.id,name:p.name,index:p.index,color:p.color})) };
}
function broadcastRoom(room){ io.to(room.code).emit('roomUpdate', roomInfo(room)); }

io.on('connection', socket => {
  socket.on('createRoom', ({name}) => {
    name = String(name||'Jogador 1').trim().slice(0,20) || 'Jogador 1';
    const c=code();
    const room={code:c,hostId:socket.id,started:false,players:[{id:socket.id,name,index:0,color:COLORS[0]}],state:null};
    rooms.set(c,room); socket.join(c); socket.data.room=c; socket.data.index=0;
    socket.emit('roomCreated', roomInfo(room)); broadcastRoom(room);
  });

  socket.on('joinRoom', ({roomCode,name}) => {
    const c=String(roomCode||'').trim().toUpperCase();
    const room=rooms.get(c);
    if(!room) return socket.emit('errorMessage','Sala não encontrada.');
    if(room.started) return socket.emit('errorMessage','A partida já começou.');
    if(room.players.length>=8) return socket.emit('errorMessage','Sala cheia.');
    name=String(name||'Jogador').trim().slice(0,20)||`Jogador ${room.players.length+1}`;
    const index=room.players.length;
    room.players.push({id:socket.id,name,index,color:COLORS[index]});
    socket.join(c); socket.data.room=c; socket.data.index=index;
    socket.emit('roomJoined',roomInfo(room)); broadcastRoom(room);
  });

  socket.on('startGame', () => {
    const room=rooms.get(socket.data.room); if(!room || room.hostId!==socket.id) return;
    if(room.players.length<2) return socket.emit('errorMessage','Entre com pelo menos 2 jogadores.');
    room.started=true; io.to(room.code).emit('gameStarted',{players:roomInfo(room).players});
  });

// Guests send player actions to the host.
// Only the player whose turn it is can play.
socket.on('playerAction', action => {
    const room = rooms.get(socket.data.room);
    if (!room || !room.started) return;

    if (!action || typeof action.type !== 'string') return;

  // Somente o jogador da vez pode enviar qualquer ação.
const currentPlayer = room.state?.jogadorAtual;

if (
    currentPlayer === undefined ||
    currentPlayer === null ||
    Number(currentPlayer) !== Number(socket.data.index)
) {
    socket.emit('errorMessage', 'Não é a sua vez de jogar!');
    return;
}

    io.to(room.hostId).emit('remoteAction', {
        ...action,
        playerId: socket.id,
        playerIndex: socket.data.index
    });
});

  // Only the host may publish the authoritative state.
  socket.on('publishState', state => {
    const room=rooms.get(socket.data.room); if(!room || room.hostId!==socket.id) return;
    room.state=state; socket.to(room.code).emit('stateUpdate',state);
  });

  socket.on('disconnect',()=>{
    const c=socket.data.room; if(!c) return;
    const room=rooms.get(c); if(!room) return;
    if(room.hostId===socket.id){
      io.to(c).emit('hostDisconnected'); rooms.delete(c); return;
    }
    room.players=room.players.filter(p=>p.id!==socket.id);
    room.players.forEach((p,i)=>p.index=i);
    broadcastRoom(room);
  });
});

const PORT=process.env.PORT||3000;
server.listen(PORT,()=>console.log(`Desafio Total Online: http://localhost:${PORT}`));
