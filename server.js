const path = require('path');
const fs = require('fs');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
  transports: ['websocket', 'polling'],
  connectionStateRecovery: { maxDisconnectionDuration: 120000, skipMiddlewares: true }
});
const ROOT = __dirname;

app.get('/', (_req, res) => {
  try {
    let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const tags = [
      '<link rel="stylesheet" href="board-size.css?v=1">',
      '<script src="extras.js"></script>',
      '<script src="reward-system.js?v=1"></script>',
      '<script src="achievements-system.js?v=1"></script>',
      '<script src="path-system.js?v=1"></script>'
    ];
    if (!html.includes(tags[0])) html = html.replace('</head>', `${tags[0]}\n</head>`);
    for (const tag of tags.slice(1)) if (!html.includes(tag)) html = html.replace('</body>', `${tag}\n</body>`);
    res.type('html').send(html);
  } catch (error) { res.status(500).send('Erro ao carregar o jogo.'); }
});

app.use(express.static(ROOT));
const rooms = new Map();
const disconnectTimers = new Map();
const matchmakingQueue = [];
const COLORS = ['#ef4444','#3b82f6','#22c55e','#eab308','#a855f7','#f97316','#ec4899','#06b6d4'];
const ALLOWED_ACTIONS = new Set(['roll','answerQuestion','answerChallenge','useCard','concludeChaos']);
app.get('/health', (_req,res) => res.json({ok:true,rooms:rooms.size,queue:matchmakingQueue.length}));

function code(){const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let value;do{value='';for(let i=0;i<5;i++)value+=chars[Math.floor(Math.random()*chars.length)];}while(rooms.has(value));return value;}
function roomInfo(room){return{code:room.code,started:room.started,hostId:room.hostId,players:room.players.map(p=>({id:p.id,name:p.name,index:p.index,color:p.color}))};}
function broadcastRoom(room){io.to(room.code).emit('roomUpdate',roomInfo(room));}
function getRoom(socket){return socket.data.room?rooms.get(socket.data.room):null;}
function cancelDisconnectTimer(socketId){const timer=disconnectTimers.get(socketId);if(timer)clearTimeout(timer);disconnectTimers.delete(socketId);}
function removeFromQueue(socketId){for(let i=matchmakingQueue.length-1;i>=0;i--)if(matchmakingQueue[i].id===socketId)matchmakingQueue.splice(i,1);}

function scheduleDisconnect(socket){
  cancelDisconnectTimer(socket.id);
  removeFromQueue(socket.id);
  const roomCode=socket.data.room;if(!roomCode)return;
  const timer=setTimeout(()=>{
    disconnectTimers.delete(socket.id);
    const room=rooms.get(roomCode);if(!room)return;
    if(!room.players.some(player=>player.id===socket.id))return;
    if(room.hostId===socket.id){io.to(room.code).emit('hostDisconnected');rooms.delete(room.code);return;}
    room.players=room.players.filter(player=>player.id!==socket.id);
    room.players.forEach((player,index)=>{player.index=index;const member=io.sockets.sockets.get(player.id);if(member)member.data.index=index;});
    if(!room.players.length){rooms.delete(room.code);return;}
    if(room.state){const current=Number(room.state.jogadorAtual);room.state.jogadorAtual=Math.max(0,Math.min(current,room.players.length-1));}
    broadcastRoom(room);
  },120000);
  disconnectTimers.set(socket.id,timer);
}

function startRoom(room){
  if(!room||room.started||room.players.length<2)return false;
  room.started=true;room.state={jogadorAtual:0,partidaTerminou:false};room.lastPublishedState=null;
  io.to(room.code).emit('gameStarted',{players:roomInfo(room).players});
  return true;
}

function tryMatchmaking(){
  for(let i=matchmakingQueue.length-1;i>=0;i--){
    const entry=matchmakingQueue[i];
    const socket=io.sockets.sockets.get(entry.id);
    if(!socket||socket.data.room)matchmakingQueue.splice(i,1);
  }
  while(matchmakingQueue.length>=2){
    const first=matchmakingQueue.shift();
    const second=matchmakingQueue.shift();
    const host=io.sockets.sockets.get(first.id);const guest=io.sockets.sockets.get(second.id);
    if(!host||!guest){if(host)matchmakingQueue.unshift(first);if(guest)matchmakingQueue.unshift(second);continue;}
    const roomCode=code();
    const room={code:roomCode,hostId:host.id,started:false,players:[
      {id:host.id,name:first.name,index:0,color:COLORS[0]},
      {id:guest.id,name:second.name,index:1,color:COLORS[1]}
    ],state:null,lastPublishedState:null};
    rooms.set(roomCode,room);
    host.join(roomCode);guest.join(roomCode);
    host.data.room=roomCode;host.data.index=0;guest.data.room=roomCode;guest.data.index=1;
    cancelDisconnectTimer(host.id);cancelDisconnectTimer(guest.id);
    host.emit('matchFound',{code:roomCode,opponent:second.name});
    guest.emit('matchFound',{code:roomCode,opponent:first.name});
    host.emit('roomCreated',roomInfo(room));guest.emit('roomJoined',roomInfo(room));
    broadcastRoom(room);
    startRoom(room);
  }
}

io.on('connection',socket=>{
  if(socket.recovered){
    cancelDisconnectTimer(socket.id);
    const recoveredRoom=getRoom(socket);
    if(recoveredRoom){broadcastRoom(recoveredRoom);if(recoveredRoom.started&&recoveredRoom.lastPublishedState)socket.emit('stateUpdate',recoveredRoom.lastPublishedState);}
  }

  socket.on('findMatch',({name}={})=>{
    if(socket.data.room)return socket.emit('errorMessage','Você já está em uma sala.');
    removeFromQueue(socket.id);
    name=String(name||'Jogador').trim().slice(0,20)||'Jogador';
    matchmakingQueue.push({id:socket.id,name});
    socket.data.matchmaking=true;
    socket.emit('matchmakingWaiting',{position:matchmakingQueue.findIndex(item=>item.id===socket.id)+1});
    tryMatchmaking();
  });

  socket.on('cancelMatch',()=>{removeFromQueue(socket.id);socket.data.matchmaking=false;socket.emit('matchmakingCancelled');});

  socket.on('createRoom',({name}={})=>{
    if(socket.data.room)return socket.emit('errorMessage','Você já está em uma sala.');
    removeFromQueue(socket.id);socket.data.matchmaking=false;
    name=String(name||'Jogador 1').trim().slice(0,20)||'Jogador 1';const roomCode=code();
    const room={code:roomCode,hostId:socket.id,started:false,players:[{id:socket.id,name,index:0,color:COLORS[0]}],state:null,lastPublishedState:null};
    rooms.set(roomCode,room);socket.join(roomCode);socket.data.room=roomCode;socket.data.index=0;socket.emit('roomCreated',roomInfo(room));broadcastRoom(room);
  });

  socket.on('joinRoom',({roomCode,name}={})=>{
    if(socket.data.room)return socket.emit('errorMessage','Você já está em uma sala.');
    removeFromQueue(socket.id);socket.data.matchmaking=false;
    const normalizedCode=String(roomCode||'').trim().toUpperCase(),room=rooms.get(normalizedCode);
    if(!room)return socket.emit('errorMessage','Sala não encontrada.');if(room.started)return socket.emit('errorMessage','A partida já começou.');if(room.players.length>=8)return socket.emit('errorMessage','Sala cheia.');
    name=String(name||'Jogador').trim().slice(0,20)||`Jogador ${room.players.length+1}`;const index=room.players.length;
    room.players.push({id:socket.id,name,index,color:COLORS[index]});socket.join(normalizedCode);socket.data.room=normalizedCode;socket.data.index=index;socket.emit('roomJoined',roomInfo(room));broadcastRoom(room);
  });

  socket.on('startGame',()=>{const room=getRoom(socket);if(!room||room.hostId!==socket.id||room.started)return;if(room.players.length<2)return socket.emit('errorMessage','Entre com pelo menos 2 jogadores.');startRoom(room);});

  socket.on('playerAction',action=>{
    const room=getRoom(socket);if(!room||!room.started||!action||typeof action.type!=='string'||!ALLOWED_ACTIONS.has(action.type))return;
    const playerIndex=Number(socket.data.index),currentPlayer=Number(room.state?.jogadorAtual);
    if(!Number.isInteger(playerIndex)||playerIndex<0||playerIndex>=room.players.length)return;if(!Number.isInteger(currentPlayer)||currentPlayer<0||currentPlayer>=room.players.length)return socket.emit('errorMessage','Aguarde a sincronização da partida.');
    if(currentPlayer!==playerIndex)return socket.emit('errorMessage','Não é a sua vez de jogar!');
    io.to(room.hostId).emit('remoteAction',{type:action.type,index:Number.isInteger(Number(action.index))?Number(action.index):undefined,playerId:socket.id,playerIndex});
  });

  socket.on('partyEmote',({emoji}={})=>{const room=getRoom(socket),allowed=new Set(['😂','😱','🔥','👍','😡','🎉']);if(!room||!allowed.has(emoji))return;io.to(room.code).emit('partyEmote',{emoji,playerId:socket.id});});

  socket.on('publishState',state=>{
    const room=getRoom(socket);if(!room||room.hostId!==socket.id||!room.started||!state||!Array.isArray(state.players))return;
    room.state={jogadorAtual:Number.isInteger(Number(state.jogadorAtual))?Number(state.jogadorAtual):0,partidaTerminou:!!state.partidaTerminou};
    const stateKey=JSON.stringify(state);if(stateKey===room.lastPublishedState)return;room.lastPublishedState=stateKey;socket.to(room.code).emit('stateUpdate',state);
  });

  socket.on('disconnect',()=>scheduleDisconnect(socket));
});

const PORT=process.env.PORT||3000;server.listen(PORT,()=>console.log(`Desafio Total Online: http://localhost:${PORT}`));
