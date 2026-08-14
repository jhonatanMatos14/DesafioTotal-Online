  document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const overlay = document.getElementById('onlineOverlay');
  const status = document.getElementById('onlineStatus');
  const join = document.getElementById('onlineJoin');
  const roomView = document.getElementById('onlineRoomView');
  const nameInput = document.getElementById('onlineName');
  const roomInput = document.getElementById('onlineRoom');
  const playersEl = document.getElementById('onlinePlayers');
  const codeEl = document.getElementById('onlineRoomCode');
  const startBtn = document.getElementById('btnIniciarOnline');
  const createBtn = document.getElementById('btnCriarSala');
  const joinBtn = document.getElementById('btnEntrarSala');
  const leaveBtn = document.getElementById('btnSairSala');

  let room = null;
  let me = null;
  let isHost = false;
  let started = false;
  let lastState = null;

  function setStatus(t, error=false){ status.textContent=t; status.style.color=error?'#ff6b6b':''; }
  function showRoom(info){
    room=info; me=info.players.find(p=>p.id===socket.id)||me; isHost=info.hostId===socket.id;
    join.hidden=true; roomView.hidden=false; codeEl.textContent=info.code;
    playersEl.innerHTML=info.players.map((p,i)=>`<div class="online-player ${p.id===info.hostId?'ready':''}"><strong>${i+1}. ${escapeHtml(p.name)}</strong><small>${p.id===info.hostId?'👑 HOST':'🎮 JOGADOR'} ${p.id===socket.id?'• VOCÊ':''}</small></div>`).join('');
    startBtn.hidden=!isHost; startBtn.disabled=info.players.length<2 || info.started;
    setStatus(info.started?'Partida em andamento.':'Sala pronta. Aguarde os jogadores.');
  }
  function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}

  createBtn.onclick=()=>{ const name=nameInput.value.trim()||'Jogador 1'; socket.emit('createRoom',{name}); };
  joinBtn.onclick=()=>{ const name=nameInput.value.trim()||'Jogador'; const code=roomInput.value.trim().toUpperCase(); if(code.length!==5) return setStatus('Digite o código de 5 caracteres.',true); socket.emit('joinRoom',{name,roomCode:code}); };
  startBtn.onclick=()=>socket.emit('startGame');
  leaveBtn.onclick=()=>{ location.reload(); };

  socket.on('connect',()=>setStatus('Conectado. Crie uma sala ou entre em uma.'));
  socket.on('connect_error',()=>setStatus('Não foi possível conectar ao servidor.',true));
  socket.on('errorMessage',msg=>setStatus(msg,true));
  socket.on('roomCreated',showRoom); socket.on('roomJoined',showRoom); socket.on('roomUpdate',showRoom);
  socket.on('hostDisconnected',()=>{ alert('O host saiu. A sala foi encerrada.'); location.reload(); });

  socket.on('gameStarted', data=>{
    started=true;
    me=data.players.find(p=>p.id===socket.id)||me;
    room={...(room||{}),started:true,players:data.players};
    overlay.style.display='none';
    if(isHost){
      onlineStartAsHost(data.players);
    } else {
      jogadores = data.players.map(p=>({nome:p.name,cor:p.color,posicao:1,pontos:0,escudo:false}));
      jogadorAtual=0; partidaTerminou=false; historico=[];
      prepararBaralhos(); sortearCasasEspeciais(); criarTabuleiro(); atualizarPlacar(); atualizarJogador(); renderHistorico(); mostrarTela(telaTabuleiro); btnDado.disabled = !(me && Number(me.index) === Number(jogadorAtual));
    }
  });

  // HOST: initialize the existing game engine with the players from the room.
  window.onlineStartAsHost = function(players){
    jogadores=players.map(p=>({nome:p.name,cor:p.color,posicao:1,pontos:0,escudo:false,onlineId:p.id}));
    jogadorAtual=0; partidaTerminou=false; perguntaAtual=null; desafioAtual=null; jogadorDoDesafio=null; historico=[];
    prepararBaralhos(); sortearCasasEspeciais(); dado.textContent='🎲'; btnDado.disabled = !(me && me.index === jogadorAtual); renderHistorico(); criarTabuleiro(); atualizarPlacar(); atualizarJogador(); mensagemJogo.textContent='Partida online iniciada!'; mostrarTela(telaTabuleiro);
  };

  function setSet(target, values){ target.clear(); values.forEach(v=>target.add(v)); }
  function snapshot(){
    const phase = document.getElementById('modalPergunta').classList.contains('aberta')?'pergunta':document.getElementById('modalDesafio').classList.contains('aberta')?'desafio':document.getElementById('modalCarta').classList.contains('aberta')?'carta':document.getElementById('modalCaos').classList.contains('aberta')?'caos':null;
    let modal=null;
    if(phase==='pergunta' && perguntaAtual) modal={tema:perguntaAtual.tema,pergunta:perguntaAtual.pergunta,opcoes:perguntaAtual.opcoes,correta:perguntaAtual.correta,dificuldade:perguntaAtual.dificuldade};
    if(phase==='desafio' && desafioAtual) modal={tema:desafioAtual.tema,pergunta:desafioAtual.pergunta,opcoes:desafioAtual.opcoes,correta:desafioAtual.correta,recompensa:desafioAtual.recompensa,penalidade:desafioAtual.penalidade,recuo:desafioAtual.recuo};
    if(phase==='carta'){ const j=jogadores[jogadorAtual]; const c=j?.cartaAtual; if(c) modal={nome:c.nome,efeito:c.efeito,cor:c.cor,tipo:c.tipo}; }
    if(phase==='caos'){ const j=jogadores[jogadorAtual]; const e=j?.eventoCaosAtual; if(e) modal={nome:e.nome,efeito:e.efeito,tipo:e.tipo}; }
    const sets={pergunta:[...CASAS_PERGUNTA],desafio:[...CASAS_DESAFIO],carta:[...CASAS_CARTA],bonus:[...CASAS_BONUS],penalidade:[...CASAS_PENALIDADE],caos:[...CASAS_CAO]};
    return {players:jogadores.map(j=>({nome:j.nome,cor:j.cor,posicao:j.posicao,pontos:j.pontos,escudo:!!j.escudo})),jogadorAtual,partidaTerminou,historico:[...historico],dado:dado.textContent,mensagem:mensagemJogo.textContent,sets,phase,modal};
  }
  function publish(){ if(isHost && started) socket.emit('publishState',snapshot()); }
  setInterval(publish,350);

  function renderRemote(s){
    if(!s) return; lastState=s;
    jogadores=s.players.map(p=>({...p})); jogadorAtual=s.jogadorAtual; partidaTerminou=s.partidaTerminou; historico=s.historico||[];
    setSet(CASAS_PERGUNTA,s.sets.pergunta); setSet(CASAS_DESAFIO,s.sets.desafio); setSet(CASAS_CARTA,s.sets.carta); setSet(CASAS_BONUS,s.sets.bonus); setSet(CASAS_PENALIDADE,s.sets.penalidade); setSet(CASAS_CAO,s.sets.caos);
    dado.textContent=s.dado||'🎲'; mensagemJogo.textContent=s.mensagem||''; criarTabuleiro(); atualizarTodasAsPecas(); atualizarPlacar(); atualizarJogador(); renderHistorico();
    renderModalRemote(s);
    btnDado.disabled = !(me && Number(me.index) === Number(jogadorAtual));
  }
  socket.on('stateUpdate',renderRemote);

  function renderModalRemote(s){
    document.querySelectorAll('.modal-pergunta,.modal-desafio,.modal-carta,.modal-caos').forEach(m=>m.classList.remove('aberta'));
    if(!s.phase||!s.modal) return;
    if(s.phase==='pergunta'){
      temaPergunta.textContent=`${s.modal.tema}${s.modal.dificuldade==='difícil'?' • 🧠 DIFÍCIL':''}`;
      regraPergunta.textContent=`Acertou: +${s.modal.dificuldade==='difícil'?10:5} • Errou: -${s.modal.dificuldade==='difícil'?5:3} e -${s.modal.dificuldade==='difícil'?3:2} casas`;
      textoPergunta.textContent=s.modal.pergunta; opcoesPergunta.innerHTML=''; s.modal.opcoes.forEach((o,i)=>{const b=document.createElement('button');b.className='opcao-pergunta';b.textContent=`${String.fromCharCode(65+i)}) ${o}`;b.disabled=me?.index!==s.jogadorAtual;b.onclick=()=>sendAction('answerQuestion',{index:i});opcoesPergunta.appendChild(b)}); modalPergunta.classList.add('aberta');
    } else if(s.phase==='desafio'){
      textoDesafio.textContent=s.modal.pergunta; efeitoDesafio.textContent=`🎯 ${s.modal.tema} • Acerte: +${s.modal.recompensa} pontos | Erre: -${s.modal.penalidade} pontos e recue ${s.modal.recuo} casas.`; opcoesDesafio.innerHTML=''; s.modal.opcoes.forEach((o,i)=>{const b=document.createElement('button');b.className='opcao-desafio';b.textContent=`${String.fromCharCode(65+i)}) ${o}`;b.disabled=me?.index!==s.jogadorAtual;b.onclick=()=>sendAction('answerChallenge',{index:i});opcoesDesafio.appendChild(b)}); modalDesafio.classList.add('aberta');
    } else if(s.phase==='carta'){
      textoCarta.textContent=s.modal.nome; efeitoCarta.textContent=s.modal.efeito; btnUsarCarta.disabled=me?.index!==s.jogadorAtual; btnUsarCarta.onclick=()=>sendAction('useCard'); modalCarta.classList.add('aberta');
    } else if(s.phase==='caos'){
      textoCaos.textContent=s.modal.nome; efeitoCaos.textContent=s.modal.efeito; btnConcluirCaos.disabled=me?.index!==s.jogadorAtual; btnConcluirCaos.onclick=()=>sendAction('concludeChaos'); modalCaos.classList.add('aberta');
    }
  }
  function sendAction(type,payload={}){ socket.emit('playerAction',{type,...payload}); }

  // On guests, turn controls become remote commands instead of local game logic.
  document.addEventListener('click', e=>{
    if(isHost || !started) return;
    if(e.target.closest('#btnDado')){ if(me?.index===jogadorAtual) {e.preventDefault();e.stopImmediatePropagation();sendAction('roll');} else {e.preventDefault();e.stopImmediatePropagation();} }
    if(e.target.closest('#btnReiniciar')||e.target.closest('#btnMenu')){e.preventDefault();e.stopImmediatePropagation();}
  }, true);

  // Host executes commands from guests. The existing game functions remain the source of truth.
  socket.on('remoteAction', action=>{
    if(!isHost || !started) return;
    const idx=Number(action.playerIndex);
    if(idx!==jogadorAtual) return;
    const j=jogadores[jogadorAtual];
    if(action.type==='roll') return jogarDado();
    if(action.type==='answerQuestion' && perguntaAtual) return responderPergunta(Number(action.index),j);
    if(action.type==='answerChallenge' && desafioAtual) return responderDesafio(Number(action.index));
    if(action.type==='useCard') return btnUsarCarta.click();
    if(action.type==='concludeChaos') return btnConcluirCaos.click();
  });

  // Host answer buttons should stay local. Guests need to know when it is their turn.
  nameInput?.addEventListener('keydown',e=>{if(e.key==='Enter')createBtn.click()});
  roomInput?.addEventListener('keydown',e=>{if(e.key==='Enter')joinBtn.click()});
});
