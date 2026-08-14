(() => {
  const board = document.getElementById('tabuleiro');
  if (!board) return;

  function melhorarBonecos() {
    const pieces = [...board.querySelectorAll('.peca-jogador')];
    const activeRow = document.querySelector('.placar-jogador.jogador-ativo');
    const activeName = activeRow?.querySelector('span')?.textContent?.replace(/^\d+\.\s*/, '').trim();
    const finished = !activeRow;

    pieces.forEach((piece, index) => {
      const title = piece.getAttribute('title') || '';
      const name = title.split(' • ')[0] || `Jogador ${index + 1}`;
      piece.dataset.nome = name;
      const active = !finished && name === activeName;
      piece.classList.toggle('ativo', active);

      let arrow = piece.querySelector('.turn-arrow');
      if (active) {
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

  const observer = new MutationObserver(() => requestAnimationFrame(melhorarBonecos));
  observer.observe(board, { childList: true, subtree: true });
  document.addEventListener('click', e => {
    if (e.target.closest('#btnDado')) setTimeout(melhorarBonecos, 120);
  });
  setInterval(melhorarBonecos, 300);
})();
