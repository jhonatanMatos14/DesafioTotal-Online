document.addEventListener('DOMContentLoaded', () => {
  const socket = window.io();
  const join = document.getElementById('onlineJoin');
  const nameInput = document.getElementById('onlineName');
  const status = document.getElementById('onlineStatus');
  const quickBtn = document.getElementById('btnEncontrarPartida');
  const cancelBtn = document.getElementById('btnCancelarBusca');

  if (!quickBtn || !cancelBtn) return;

  quickBtn.addEventListener('click', () => {
    const name = nameInput?.value.trim() || 'Jogador';
    quickBtn.hidden = true;
    cancelBtn.hidden = false;
    if (status) status.textContent = 'Procurando um adversário...';
    socket.emit('findMatch', { name });
  });

  cancelBtn.addEventListener('click', () => {
    socket.emit('cancelMatch');
    quickBtn.hidden = false;
    cancelBtn.hidden = true;
    if (status) status.textContent = 'Busca cancelada. Crie ou entre em uma sala.';
  });

  socket.on('matchmakingWaiting', ({ position } = {}) => {
    if (status) status.textContent = `Procurando adversário... posição ${position || 1}`;
  });

  socket.on('matchFound', ({ opponent } = {}) => {
    if (status) status.textContent = `Partida encontrada contra ${opponent || 'outro jogador'}!`;
    quickBtn.hidden = true;
    cancelBtn.hidden = true;
  });

  socket.on('matchmakingCancelled', () => {
    quickBtn.hidden = false;
    cancelBtn.hidden = true;
  });

  socket.on('roomCreated', () => {
    quickBtn.hidden = true;
    cancelBtn.hidden = true;
  });

  socket.on('roomJoined', () => {
    quickBtn.hidden = true;
    cancelBtn.hidden = true;
  });

  socket.on('connect', () => {
    if (join && !join.hidden) {
      quickBtn.hidden = false;
      cancelBtn.hidden = true;
    }
  });
});
