/* Desafio Total - movimento e interações robustas */
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

  function atualizarVisual() {
    if (typeof atualizarPlacar === 'function') atualizarPlacar();
    if (typeof atualizarTodasAsPecas === 'function') atualizarTodasAsPecas();
  }
  function limite(pos) { return Math.max(1, Math.min(TOTAL_CASAS, Number(pos) || 1)); }
  function jogadorDaVezAtual() { return Array.isArray(jogadores) ? jogadores[jogadorAtual] : null; }

  function onlineNaoHost() {
    const overlay = document.getElementById('onlineOverlay');
    const start = document.getElementById('btnIniciarOnline');
    return !!(overlay && overlay.style.display === 'none' && start && start.hidden);
  }

  function moverComAnimacao(jogador, inicio, fim, depois) {
    inicio = limite(inicio); fim = limite(fim);
    jogador.posicao = fim;
    atualizarVisual();
    if (inicio === fim) return depois?.();

    let p = inicio;
    const passo = inicio < fim ? 1 : -1;
    const id = setInterval(() => {
      p += passo;
      jogador.posicaoVisual = p;
      if (typeof atualizarTodasAsPecas === 'function') atualizarTodasAsPecas();
      if (p === fim) {
        clearInterval(id);
        jogador.posicaoVisual = undefined;
        atualizarVisual();
        depois?.();
      }
    }, 90);
  }

  passarVez = function() {
    if (!Array.isArray(jogadores) || !jogadores.length || partidaTerminou) return;
    jogadorAtual = (jogadorAtual + 1) % jogadores.length;
    atualizarJogador();
    atualizarPlacar();
    if (typeof btnDado !== 'undefined') btnDado.disabled = false;
    if (typeof mensagemJogo !== 'undefined' && jogadores[jogadorAtual]) {
      mensagemJogo.textContent += ` Agora é a vez de ${jogadores[jogadorAtual].nome}.`;
    }
  };

  btnUsarCarta.addEventListener('click', event => {
    if (onlineNaoHost()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (window.__dtCardBusy) return;
    const jogador = jogadorDaVezAtual();
    const carta = jogador?.cartaAtual;
    if (!jogador || !carta) return;
    window.__dtCardBusy = true;
    btnUsarCarta.disabled = true;

    const antes = limite(jogador.posicao);
    const novamente = carta.tipo === 'novamente';

    if (carta.tipo === 'escudo') {
      jogador.escudo = true;
      mensagemJogo.textContent = `🛡️ ${jogador.nome} ativou o Escudo da Sorte!`;
    } else if (carta.tipo === 'roubo') {
      const adversarios = jogadores.filter((_, i) => i !== jogadorAtual);
      if (adversarios.length) {
        const alvo = adversarios[Math.floor(Math.random() * adversarios.length)];
        const roubado = Math.min(3, Math.max(0, alvo.pontos));
        alvo.pontos -= roubado;
        jogador.pontos += roubado;
        mensagemJogo.textContent = `💰 ${jogador.nome} roubou ${roubado} pontos de ${alvo.nome}!`;
      }
    } else if (carta.tipo === 'troca') {
      const adversarios = jogadores.filter((_, i) => i !== jogadorAtual);
      if (adversarios.length) {
        const alvo = [...adversarios].sort((a,b) =>
          Math.abs(a.posicao - jogador.posicao) - Math.abs(b.posicao - jogador.posicao)
        )[0];
        const posJogador = limite(jogador.posicao);
        const posAlvo = limite(alvo.posicao);
        jogador.posicao = posAlvo;
        alvo.posicao = posJogador;
        mensagemJogo.textContent = `🔄 ${jogador.nome} trocou de posição com ${alvo.nome}!`;
      }
    } else if (typeof carta.aplicar === 'function') {
      carta.aplicar(jogador);
      jogador.posicao = limite(jogador.posicao);
    }

    const depois = limite(jogador.posicao);
    jogador.posicao = depois;
    const finalizarCarta = () => {
      if (jogador.cartaAtual === carta) jogador.cartaAtual = null;
      modalCarta.classList.remove('aberta');
      atualizarVisual();
      registrarAcao(jogador, `usou a carta ${carta.nome.replace(/^[^A-Z0-9À-ÿ]+/, '')}`);

      if (jogador.posicao >= TOTAL_CASAS) {
        jogador.posicao = TOTAL_CASAS;
        finalizarPartida(jogador);
      } else if (novamente) {
        btnDado.disabled = false;
        mensagemJogo.textContent = `🎲 ${jogador.nome} joga novamente!`;
      } else {
        setTimeout(() => passarVez(), 300);
      }
      window.__dtCardBusy = false;
      if (!partidaTerminou && !novamente) btnUsarCarta.disabled = false;
    };

    if (antes !== depois) moverComAnimacao(jogador, antes, depois, finalizarCarta);
    else { atualizarVisual(); finalizarCarta(); }
  }, true);

  btnConcluirCaos.addEventListener('click', event => {
    if (onlineNaoHost()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (window.__dtChaosBusy) return;
    const jogador = jogadorDaVezAtual();
    const evento = jogador?.eventoCaosAtual;
    if (!jogador || !evento) return;
    window.__dtChaosBusy = true;
    btnConcluirCaos.disabled = true;

    const antes = limite(jogador.posicao);
    evento.aplicar(jogador);
    jogador.posicao = limite(jogador.posicao);
    const depois = jogador.posicao;

    const finalizar = () => {
      jogador.eventoCaosAtual = null;
      modalCaos.classList.remove('aberta');
      atualizarVisual();
      registrarAcao(jogador, `ativou ${evento.nome.replace(/^[^A-ZÀ-ÿ0-9]+/, '')}`);
      if (jogador.posicao >= TOTAL_CASAS) {
        jogador.posicao = TOTAL_CASAS;
        finalizarPartida(jogador);
      } else if (evento.tipo === 'novamente') {
        btnDado.disabled = false;
        mensagemJogo.textContent += ' Você joga novamente!';
      } else {
        setTimeout(() => passarVez(), 350);
      }
      window.__dtChaosBusy = false;
    };

    if (antes !== depois) moverComAnimacao(jogador, antes, depois, finalizar);
    else { atualizarVisual(); finalizar(); }
  }, true);

  const responderPerguntaAnterior = responderPergunta;
  responderPergunta = function(indice, jogador) {
    if (onlineNaoHost()) return responderPerguntaAnterior(indice, jogador);
    const antes = limite(jogador.posicao);
    responderPerguntaAnterior(indice, jogador);
    const depois = limite(jogador.posicao);
    if (depois < antes) {
      jogador.posicao = antes;
      moverComAnimacao(jogador, antes, depois);
    }
  };

  const responderDesafioAnterior = responderDesafio;
  responderDesafio = function(indice) {
    if (onlineNaoHost()) return responderDesafioAnterior(indice);
    const jogador = jogadorDoDesafio;
    if (!jogador) return responderDesafioAnterior(indice);
    const antes = limite(jogador.posicao);
    responderDesafioAnterior(indice);
    const depois = limite(jogador.posicao);
    if (depois < antes) {
      jogador.posicao = antes;
      moverComAnimacao(jogador, antes, depois);
    }
  };

  const aplicarPenalidadeAnterior = aplicarPenalidade;
  aplicarPenalidade = function(jogador) {
    const antes = limite(jogador.posicao);
    aplicarPenalidadeAnterior(jogador);
    const depois = limite(jogador.posicao);
    if (depois !== antes) {
      jogador.posicao = antes;
      moverComAnimacao(jogador, antes, depois);
    }
  };

  document.addEventListener('click', e => {
    if (e.target.closest('#btnDado')) setTimeout(animatePieces, 120);
  });

  // Mantém o indicador visual final do tabuleiro já usado no projeto.
  const visual = document.createElement('script');
  visual.src = 'board-final.js?v=3';
  visual.defer = true;
  document.head.appendChild(visual);
})();
