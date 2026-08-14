document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const overlay = document.getElementById("onlineOverlay");
  const status = document.getElementById("onlineStatus");
  const join = document.getElementById("onlineJoin");
  const roomView = document.getElementById("onlineRoomView");
  const nameInput = document.getElementById("onlineName");
  const roomInput = document.getElementById("onlineRoom");
  const playersEl = document.getElementById("onlinePlayers");
  const codeEl = document.getElementById("onlineRoomCode");
  const startBtn = document.getElementById("btnIniciarOnline");
  const createBtn = document.getElementById("btnCriarSala");
  const joinBtn = document.getElementById("btnEntrarSala");
  const leaveBtn = document.getElementById("btnSairSala");

  let room = null;
  let me = null;
  let isHost = false;
  let started = false;
  let lastState = null;

  function setStatus(text, error = false) {
    if (!status) return;
    status.textContent = text;
    status.style.color = error ? "#ff6b6b" : "";
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>\"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
    }[char]));
  }

  function getMeuIndice() {
    if (!room || !Array.isArray(room.players)) return -1;
    return room.players.findIndex(player => player.id === socket.id);
  }

  function showRoom(info) {
    room = info;
    me = info.players.find(player => player.id === socket.id) || me;
    isHost = info.hostId === socket.id;
    join.hidden = true;
    roomView.hidden = false;
    codeEl.textContent = info.code;
    playersEl.innerHTML = info.players.map((player, index) => `
      <div class="online-player ${player.id === info.hostId ? "ready" : ""}">
        <strong>${index + 1}. ${escapeHtml(player.name)}</strong>
        <small>${player.id === info.hostId ? "👑 HOST" : "🎮 JOGADOR"}${player.id === socket.id ? " • VOCÊ" : ""}</small>
      </div>
    `).join("");
    startBtn.hidden = !isHost;
    startBtn.disabled = info.players.length < 2 || info.started;
    setStatus(info.started ? "Partida em andamento." : "Sala pronta. Aguarde os jogadores.");
  }

  createBtn.onclick = () => {
    const name = nameInput.value.trim() || "Jogador 1";
    createBtn.disabled = true;
    socket.emit("createRoom", { name });
  };

  joinBtn.onclick = () => {
    const name = nameInput.value.trim() || "Jogador";
    const code = roomInput.value.trim().toUpperCase();
    if (code.length !== 5) return setStatus("Digite o código de 5 caracteres.", true);
    joinBtn.disabled = true;
    socket.emit("joinRoom", { name, roomCode: code });
  };

  startBtn.onclick = () => {
    if (!isHost || !room || room.players.length < 2) return;
    startBtn.disabled = true;
    socket.emit("startGame");
  };

  leaveBtn.onclick = () => location.reload();

  socket.on("connect", () => {
    createBtn.disabled = false;
    joinBtn.disabled = false;
    setStatus("Conectado. Crie uma sala ou entre em uma.");
  });

  socket.on("disconnect", () => setStatus("Conexão perdida. Tentando reconectar...", true));

  socket.on("connect_error", () => {
    createBtn.disabled = false;
    joinBtn.disabled = false;
    setStatus("Não foi possível conectar ao servidor.", true);
  });

  socket.on("errorMessage", message => {
    createBtn.disabled = false;
    joinBtn.disabled = false;
    startBtn.disabled = false;
    setStatus(message, true);
  });

  socket.on("roomCreated", showRoom);
  socket.on("roomJoined", showRoom);
  socket.on("roomUpdate", showRoom);

  socket.on("hostDisconnected", () => {
    alert("O host saiu. A sala foi encerrada.");
    location.reload();
  });

  socket.on("gameStarted", data => {
    started = true;
    room = { ...(room || {}), started: true, players: data.players };
    me = data.players.find(player => player.id === socket.id) || me;
    isHost = room.hostId === socket.id;
    overlay.style.display = "none";

    if (isHost) {
      onlineStartAsHost(data.players);
      return;
    }

    jogadores = data.players.map(player => ({
      nome: player.name, cor: player.color, posicao: 1, pontos: 0,
      escudo: false, onlineId: player.id
    }));
    jogadorAtual = 0;
    partidaTerminou = false;
    historico = [];
    prepararBaralhos();
    sortearCasasEspeciais();
    criarTabuleiro();
    atualizarPlacar();
    atualizarJogador();
    renderHistorico();
    mostrarTela(telaTabuleiro);
    btnDado.disabled = true;
  });

  window.onlineStartAsHost = function(players) {
    jogadores = players.map(player => ({
      nome: player.name, cor: player.color, posicao: 1, pontos: 0,
      escudo: false, onlineId: player.id
    }));
    jogadorAtual = 0;
    partidaTerminou = false;
    perguntaAtual = null;
    desafioAtual = null;
    jogadorDoDesafio = null;
    historico = [];
    prepararBaralhos();
    sortearCasasEspeciais();
    dado.textContent = "🎲";
    btnDado.disabled = getMeuIndice() !== jogadorAtual;
    renderHistorico();
    criarTabuleiro();
    atualizarPlacar();
    atualizarJogador();
    mensagemJogo.textContent = "Partida online iniciada!";
    mostrarTela(telaTabuleiro);
    setTimeout(publish, 50);
  };

  function setSet(target, values) {
    target.clear();
    (Array.isArray(values) ? values : []).forEach(value => target.add(Number(value)));
  }

  function snapshot() {
    const phase = modalPergunta.classList.contains("aberta") ? "pergunta"
      : modalDesafio.classList.contains("aberta") ? "desafio"
      : modalCarta.classList.contains("aberta") ? "carta"
      : modalCaos.classList.contains("aberta") ? "caos" : null;

    let modal = null;
    if (phase === "pergunta" && perguntaAtual) {
      modal = { tema: perguntaAtual.tema, pergunta: perguntaAtual.pergunta, opcoes: perguntaAtual.opcoes,
        correta: perguntaAtual.correta, dificuldade: perguntaAtual.dificuldade };
    }
    if (phase === "desafio" && desafioAtual) {
      modal = { tema: desafioAtual.tema, pergunta: desafioAtual.pergunta, opcoes: desafioAtual.opcoes,
        correta: desafioAtual.correta, recompensa: desafioAtual.recompensa,
        penalidade: desafioAtual.penalidade, recuo: desafioAtual.recuo };
    }
    if (phase === "carta") {
      const player = jogadores[jogadorAtual];
      const card = player?.cartaAtual;
      if (card) modal = { nome: card.nome, efeito: card.efeito, cor: card.cor, tipo: card.tipo };
    }
    if (phase === "caos") {
      const player = jogadores[jogadorAtual];
      const event = player?.eventoCaosAtual;
      if (event) modal = { nome: event.nome, efeito: event.efeito, tipo: event.tipo };
    }

    return {
      // Consistent schema: guests read state.players.
      players: jogadores.map(player => ({
        nome: player.nome, cor: player.cor, posicao: player.posicao,
        posicaoVisual: player.posicao, pontos: player.pontos, escudo: !!player.escudo
      })),
      jogadorAtual,
      partidaTerminou,
      historico: [...historico],
      dado: dado.textContent,
      mensagem: mensagemJogo.textContent,
      sets: {
        pergunta: [...CASAS_PERGUNTA], desafio: [...CASAS_DESAFIO], carta: [...CASAS_CARTA],
        bonus: [...CASAS_BONUS], penalidade: [...CASAS_PENALIDADE], caos: [...CASAS_CAO]
      },
      phase,
      modal
    };
  }

  function publish() {
    if (isHost && started) socket.emit("publishState", snapshot());
  }

  setInterval(publish, 250);

  function renderRemote(state) {
    if (!state || !Array.isArray(state.players)) return;

    const previousState = lastState;
    const previousHistoryLength = previousState?.historico?.length || 0;
    const previousDice = previousState?.dado;
    lastState = state;

    jogadores = state.players.map(player => ({ ...player }));
    jogadorAtual = Number(state.jogadorAtual) || 0;
    partidaTerminou = !!state.partidaTerminou;
    historico = state.historico || [];

    setSet(CASAS_PERGUNTA, state.sets?.pergunta);
    setSet(CASAS_DESAFIO, state.sets?.desafio);
    setSet(CASAS_CARTA, state.sets?.carta);
    setSet(CASAS_BONUS, state.sets?.bonus);
    setSet(CASAS_PENALIDADE, state.sets?.penalidade);
    setSet(CASAS_CAO, state.sets?.caos);

    dado.textContent = state.dado || "🎲";
    mensagemJogo.textContent = state.mensagem || "";
    criarTabuleiro();
    atualizarJogador();
    atualizarPlacar();
    atualizarTodasAsPecas();
    renderHistorico();
    renderModalRemote(state);
    btnDado.disabled = getMeuIndice() !== jogadorAtual || partidaTerminada;

    const houveNovaRolagem = previousDice !== undefined &&
      (state.dado !== previousDice || historico.length > previousHistoryLength);
    if (houveNovaRolagem) {
      dado.classList.remove("girando");
      void dado.offsetWidth;
      dado.classList.add("girando");
      setTimeout(() => dado.classList.remove("girando"), 1700);
    }
  }

  socket.on("stateUpdate", renderRemote);

  function renderModalRemote(state) {
    document.querySelectorAll(".modal-pergunta,.modal-desafio,.modal-carta,.modal-caos")
      .forEach(modal => modal.classList.remove("aberta"));
    if (!state.phase || !state.modal) return;

    const isMyTurn = getMeuIndice() === Number(state.jogadorAtual);

    if (state.phase === "pergunta") {
      const difficult = state.modal.dificuldade === "difícil";
      temaPergunta.textContent = `${state.modal.tema}${difficult ? " • 🧠 DIFÍCIL" : ""}`;
      regraPergunta.textContent = `Acertou: +${difficult ? 10 : 5} • Errou: -${difficult ? 5 : 3} e -${difficult ? 3 : 2} casas`;
      textoPergunta.textContent = state.modal.pergunta;
      opcoesPergunta.innerHTML = "";
      state.modal.opcoes.forEach((option, index) => {
        const button = document.createElement("button");
        button.className = "opcao-pergunta";
        button.textContent = `${String.fromCharCode(65 + index)}) ${option}`;
        button.disabled = !isMyTurn;
        button.onclick = () => sendAction("answerQuestion", { index });
        opcoesPergunta.appendChild(button);
      });
      modalPergunta.classList.add("aberta");
      return;
    }

    if (state.phase === "desafio") {
      textoDesafio.textContent = state.modal.pergunta;
      efeitoDesafio.textContent = `🎯 ${state.modal.tema} • Acerte: +${state.modal.recompensa} pontos | Erre: -${state.modal.penalidade} pontos e recue ${state.modal.recuo} casas.`;
      opcoesDesafio.innerHTML = "";
      state.modal.opcoes.forEach((option, index) => {
        const button = document.createElement("button");
        button.className = "opcao-desafio";
        button.textContent = `${String.fromCharCode(65 + index)}) ${option}`;
        button.disabled = !isMyTurn;
        button.onclick = () => sendAction("answerChallenge", { index });
        opcoesDesafio.appendChild(button);
      });
      modalDesafio.classList.add("aberta");
      return;
    }

    if (state.phase === "carta") {
      textoCarta.textContent = state.modal.nome;
      efeitoCarta.textContent = state.modal.efeito;
      btnUsarCarta.disabled = !isMyTurn;
      btnUsarCarta.onclick = () => sendAction("useCard");
      modalCarta.classList.add("aberta");
      return;
    }

    if (state.phase === "caos") {
      textoCaos.textContent = state.modal.nome;
      efeitoCaos.textContent = state.modal.efeito;
      btnConcluirCaos.disabled = !isMyTurn;
      btnConcluirCaos.onclick = () => sendAction("concludeChaos");
      modalCaos.classList.add("aberta");
    }
  }

  function sendAction(type, payload = {}) {
    if (started) socket.emit("playerAction", { type, ...payload });
  }

  document.addEventListener("click", event => {
    if (!started) return;

    if (event.target.closest("#btnDado")) {
      if (getMeuIndice() !== Number(jogadorAtual)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      if (!isHost) {
        event.preventDefault();
        event.stopImmediatePropagation();
        sendAction("roll");
        return;
      }
    }

    if (event.target.closest("#btnReiniciar") || event.target.closest("#btnMenu")) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  socket.on("remoteAction", action => {
    if (!isHost || !started || !action) return;
    const index = Number(action.playerIndex);
    if (index !== Number(jogadorAtual)) return;
    const player = jogadores[jogadorAtual];
    if (!player) return;

    if (action.type === "roll") return jogarDado();
    if (action.type === "answerQuestion" && perguntaAtual) return responderPergunta(Number(action.index), player);
    if (action.type === "answerChallenge" && desafioAtual) return responderDesafio(Number(action.index));
    if (action.type === "useCard") return btnUsarCarta.click();
    if (action.type === "concludeChaos") return btnConcluirCaos.click();
  });

  nameInput?.addEventListener("keydown", event => {
    if (event.key === "Enter") createBtn.click();
  });
  roomInput?.addEventListener("keydown", event => {
    if (event.key === "Enter") joinBtn.click();
  });
});
