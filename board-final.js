(() => {
  const board = document.getElementById('tabuleiro');
  if (!board) return;

  // Otimizado: não usa MutationObserver nem setInterval.
  // O jogo chama esta função apenas quando o estado visual realmente muda.
  let scheduled = false;

  function melhorarBonecos() {
    scheduled = false;
    const pieces = [...board.querySelectorAll('.peca-jogador')];
    const activeRow = document.querySelector('.placar-jogador.jogador-ativo');
    const activeName = activeRow?.querySelector('span')?.textContent?.replace(/^\d+\.\s*/, '').trim();
    const finished = !activeRow;

    pieces.forEach((piece, index) => {
      const title = piece.getAttribute('title') || '';
      const name = title.split(' • ')[0] || `Jogador ${index + 1}`;
      piece.dataset.nome = name;
      piece.classList.toggle('ativo', !finished && name === activeName);

      let arrow = piece.querySelector('.turn-arrow');
      if (!finished && name === activeName) {
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
    if (activeRow) {
      const strong = activeRow.querySelector('strong')?.textContent || '';
      const match = strong.match(/Casa\s+(\d+)/i);
      if (match) {
        const casa = board.querySelector(`[data-posicao="${match[1]}"]`);
        if (casa) casa.classList.add('atual-jogador');
      }
    }
  }

  function atualizarVisualTabuleiro() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(melhorarBonecos);
  }

  // Disponibiliza um hook leve para o movimento e o jogo principal.
  window.dtRefreshBoardVisual = atualizarVisualTabuleiro;
  window.dtImproveBoardNow = melhorarBonecos;

  document.addEventListener('click', e => {
    if (e.target.closest('#btnDado')) setTimeout(atualizarVisualTabuleiro, 100);
  });

  // Primeira renderização.
  atualizarVisualTabuleiro();
})();
