(() => {
  const board = document.getElementById('tabuleiro');
  if (!board) return;

  function animatePieces() {
    board.querySelectorAll('.peca-jogador').forEach(piece => {
      piece.classList.remove('mover');
      void piece.offsetWidth;
      piece.classList.add('mover');
    });
  }

  const observer = new MutationObserver(() => animatePieces());
  observer.observe(board, { childList: true, subtree: true });

  document.addEventListener('click', e => {
    if (e.target.closest('#btnDado')) setTimeout(animatePieces, 100);
  });

  const visual = document.createElement('script');
  visual.src = 'board-final.js?v=2';
  visual.defer = true;
  document.head.appendChild(visual);
})();
