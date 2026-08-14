(() => {
  const board = document.getElementById('tabuleiro');
  if (!board) return;

  function melhorarBonecos() {
    const players = Array.isArray(window.jogadores) ? window.jogadores : [];
    const current = Number(window.jogadorAtual);

    board.querySelectorAll('.peca-jogador').forEach((piece, index) => {
      const jogador = players[index];
      if (!jogador) return;

      piece.dataset.nome = jogador.nome || `Jogador ${index + 1}`;
      piece.classList.toggle('ativo', index === current && !window.partidaTerminou);

      let arrow = piece.querySelector('.turn-arrow');
      if (index === current && !window.partidaTerminou) {
        if (!arrow) {
          arrow = document.createElement('span');
          arrow.className = 'turn-arrow';
          arrow.textContent = '▼';
          piece.appendChild(arrow);
        }
      } else if (arrow) {
        arrow.remove();
      }
    });

    board.querySelectorAll('.casa').forEach(casa => casa.classList.remove('atual-jogador'));
    const ativo = players[current];
    if (ativo) {
      const pos = ativo.posicaoVisual || ativo.posicao;
      const casa = board.querySelector(`[data-posicao="${pos}"]`);
      if (casa) casa.classList.add('atual-jogador');
    }
  }

  const observer = new MutationObserver(() => requestAnimationFrame(melhorarBonecos));
  observer.observe(board, { childList: true, subtree: true });
  document.addEventListener('click', e => {
    if (e.target.closest('#btnDado')) setTimeout(melhorarBonecos, 120);
  });
  setInterval(melhorarBonecos, 300);
})();
