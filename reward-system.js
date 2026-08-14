(() => {
  const TOTAL = 120;
  let finalizado = false;
  let inicioPartida = Date.now();

  const style = document.createElement('style');
  style.textContent = `
    #dtRewardPanel{position:fixed;right:18px;top:18px;z-index:14000;width:min(330px,92vw);padding:16px;border:2px solid #f4c542;border-radius:18px;background:linear-gradient(145deg,#172033f5,#0b1220f5);box-shadow:0 18px 50px #000b;display:none;font-family:Arial,sans-serif}
    #dtRewardPanel.show{display:block;animation:dtRewardIn .25s ease}
    @keyframes dtRewardIn{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:none}}
    #dtRewardPanel h3{margin:0 0 8px;color:#ffd34f;font-size:20px}#dtRewardPanel p{margin:5px 0;color:#dbe7f4;font-size:13px}
    .dt-rank{display:flex;justify-content:space-between;gap:8px;padding:8px;margin-top:6px;border-radius:10px;background:#ffffff09}.dt-rank.winner{outline:2px solid #ffd34f;background:#5a421322}.dt-badge{display:inline-block;margin:4px 4px 0 0;padding:5px 7px;border-radius:8px;background:#26364b;color:#fff;font-size:11px;font-weight:900}
    #dtFinalRewards{position:fixed;inset:0;z-index:16000;display:none;align-items:center;justify-content:center;padding:18px;background:#02060ce8}.dt-final-card{width:min(700px,95vw);max-height:90vh;overflow:auto;padding:28px;border:3px solid #ffd34f;border-radius:28px;background:linear-gradient(145deg,#142238,#07101b);box-shadow:0 30px 100px #000;color:#fff}.dt-final-card h2{text-align:center;color:#ffd34f;font-size:34px;margin:0 0 8px}.dt-final-card .sub{text-align:center;color:#b8c9dc;margin-bottom:18px}.dt-final-actions{display:flex;justify-content:center;gap:10px;margin-top:18px}.dt-final-actions button{border:0;border-radius:12px;padding:12px 18px;font-weight:1000;cursor:pointer;background:#22c55e;color:#fff}.dt-medal{font-size:23px;margin-right:5px}
  `;
  document.head.appendChild(style);

  function ui(){
    if(document.getElementById('dtRewardPanel')) return;
    const p=document.createElement('div');p.id='dtRewardPanel';
    p.innerHTML='<h3>🏆 Recompensas</h3><p id="dtRewardMsg">Complete objetivos para ganhar pontos e moedas.</p><div id="dtRewardBadges"></div>';
    document.body.appendChild(p);
    const f=document.createElement('div');f.id='dtFinalRewards';
    f.innerHTML='<div class="dt-final-card"><h2>🏆 RESULTADO DA PARTIDA</h2><div class="sub">Chegar primeiro não é tudo. A pontuação final decide o campeão.</div><div id="dtFinalRanking"></div><div class="dt-final-actions"><button onclick="location.reload()">🔄 Jogar novamente</button></div></div>';
    document.body.appendChild(f);
  }

  function playerKey(p){return p.onlineId || p.id || p.nome}
  function state(p){
    if(!p.__dtRewards) p.__dtRewards={moedas:0,xp:0,conquistas:[],acoes:0,maxPos:0};
    return p.__dtRewards;
  }

  function addReward(p, moedas, xp, badge, msg){
    const s=state(p);s.moedas+=moedas;s.xp+=xp;
    if(badge && !s.conquistas.includes(badge)) s.conquistas.push(badge);
    if(msg){const el=document.getElementById('dtRewardMsg');if(el)el.textContent=msg;const panel=document.getElementById('dtRewardPanel');if(panel){panel.classList.add('show');clearTimeout(panel._timer);panel._timer=setTimeout(()=>panel.classList.remove('show'),3000)}}
  }

  function avaliar(){
    if(!Array.isArray(window.jogadores)) return;
    jogadores.forEach(p=>{
      const s=state(p);const pos=Number(p.posicao)||1;s.maxPos=Math.max(s.maxPos,pos);
      if((p.pontos||0)>=10 && !s.conquistas.includes('Primeiros 10 pontos')) addReward(p,10,20,'Primeiros 10 pontos','🎯 +10 moedas: você alcançou 10 pontos!');
      if((p.pontos||0)>=25 && !s.conquistas.includes('Mestre das perguntas')) addReward(p,25,50,'Mestre das perguntas','🧠 +25 moedas: 25 pontos conquistados!');
      if(pos>=60 && !s.conquistas.includes('Metade do caminho')) addReward(p,15,30,'Metade do caminho','🚀 +15 moedas: chegou à metade do tabuleiro!');
      if(pos>=90 && !s.conquistas.includes('Quase lá')) addReward(p,20,40,'Quase lá','🔥 +20 moedas: faltam poucas casas!');
    });
    renderBadges();
  }

  function renderBadges(){
    const el=document.getElementById('dtRewardBadges');if(!el||!Array.isArray(window.jogadores))return;
    const p=jogadores[typeof jogadorAtual==='number'?jogadorAtual:0];if(!p)return;const s=state(p);
    el.innerHTML=s.conquistas.map(x=>`<span class="dt-badge">🏅 ${x}</span>`).join('');
  }

  function finalScore(p){
    const s=state(p);const points=Number(p.pontos)||0;const pos=Number(p.posicao)||1;
    const chegada=pos>=TOTAL?50:0;
    const distancia=Math.floor(pos/2);
    const moedas=s.moedas;
    return points*10 + chegada + distancia + moedas + s.conquistas.length*15;
  }

  function finalizarComRecompensas(jogador){
    if(finalizado) return;
    finalizado=true;
    avaliar();
    const ranking=[...jogadores].map(p=>({p,score:finalScore(p)})).sort((a,b)=>b.score-a.score);
    const vencedor=ranking[0];
    const panel=document.getElementById('dtFinalRewards');
    const list=document.getElementById('dtFinalRanking');
    if(list){
      list.innerHTML=ranking.map((r,i)=>{
        const s=state(r.p);const medal=i===0?'🥇':i===1?'🥈':i===2?'🥉':'🏅';
        return `<div class="dt-rank ${i===0?'winner':''}"><span><span class="dt-medal">${medal}</span><strong>${i+1}º ${r.p.nome}</strong><br><small>📍 Casa ${r.p.posicao} • 🎯 ${r.p.pontos||0} pontos • 🪙 ${s.moedas} moedas • ⭐ ${s.xp} XP</small></span><strong>${r.score} pts finais</strong></div>`;
      }).join('');
    }
    if(panel) panel.style.display='flex';
    if(typeof partidaTerminou!=='undefined') partidaTerminou=true;
    if(typeof mensagemJogo!=='undefined') mensagemJogo.textContent=`🏆 ${vencedor.p.nome} venceu pelo melhor resultado geral!`;
    if(typeof registrarAcao==='function') registrarAcao(vencedor.p,`venceu a partida com ${vencedor.score} pontos finais`);
    if(typeof atualizarPlacar==='function') atualizarPlacar();
    if(typeof window.dtRefreshBoardVisual==='function') window.dtRefreshBoardVisual();
  }

  // A chegada ao fim inicia a apuração. O campeão é definido pelo resultado geral,
  // não simplesmente pelo primeiro jogador a tocar a casa final.
  window.finalizarPartida = finalizarComRecompensas;

  setInterval(()=>{
    try{
      if(!Array.isArray(window.jogadores)) return;
      avaliar();
      if(typeof partidaTerminou!=='undefined' && partidaTerminou && !finalizado) finalizarComRecompensas(jogadores[jogadorAtual]);
    }catch(e){}
  },1000);

  document.addEventListener('DOMContentLoaded',()=>{ui();inicioPartida=Date.now()});
  if(document.readyState!=='loading') ui();
})();
