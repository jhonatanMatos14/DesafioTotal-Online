(() => {
  const KEY = 'dt_achievements_v1';
  const catalog = [
    {id:'first-answer', icon:'🧠', name:'Primeiro Acerto', desc:'Acerte sua primeira pergunta.', reward:'20 XP + 10 moedas'},
    {id:'ten-points', icon:'🎯', name:'10 Pontos', desc:'Chegue a 10 pontos em uma partida.', reward:'30 XP + 20 moedas'},
    {id:'halfway', icon:'🚀', name:'Meio Caminho', desc:'Alcance a casa 60.', reward:'40 XP + 25 moedas'},
    {id:'card-user', icon:'🃏', name:'Mestre das Cartas', desc:'Use uma carta especial.', reward:'35 XP + 20 moedas'},
    {id:'chaos', icon:'💥', name:'Sobreviveu ao Caos', desc:'Ative um evento Caos Total.', reward:'35 XP + 20 moedas'},
    {id:'rich', icon:'🪙', name:'Colecionador', desc:'Acumule 250 moedas.', reward:'50 XP'},
    {id:'finish', icon:'🏁', name:'Linha de Chegada', desc:'Alcance a casa 120.', reward:'100 XP + 75 moedas'},
    {id:'three-games', icon:'🔥', name:'Veterano', desc:'Complete 3 partidas.', reward:'100 XP + 100 moedas'}
  ];
  let state = JSON.parse(localStorage.getItem(KEY) || '{}');
  state.unlocked = Array.isArray(state.unlocked) ? state.unlocked : [];
  state.games = Number(state.games || 0);
  let lastHistory = 0;
  let lastPos = 1;

  const save = () => localStorage.setItem(KEY, JSON.stringify(state));
  function reward(xp, coins) {
    const x = Number(localStorage.getItem('dt_xp') || 0) + xp;
    const c = Number(localStorage.getItem('dt_coins') || 0) + coins;
    localStorage.setItem('dt_xp', String(x));
    localStorage.setItem('dt_coins', String(c));
    const xpEl = document.getElementById('dtXp');
    const coinEl = document.getElementById('dtCoins');
    if (xpEl) xpEl.textContent = x;
    if (coinEl) coinEl.textContent = c;
  }
  function unlock(id) {
    if (state.unlocked.includes(id)) return;
    const item = catalog.find(x => x.id === id); if (!item) return;
    state.unlocked.push(id); save();
    const rewards = { 'first-answer':[20,10], 'ten-points':[30,20], 'halfway':[40,25], 'card-user':[35,20], 'chaos':[35,20], 'rich':[50,0], 'finish':[100,75], 'three-games':[100,100] };
    reward(...rewards[id]);
    announce(`🏆 CONQUISTA DESBLOQUEADA: ${item.name}!`);
  }
  function announce(text) {
    const el=document.getElementById('dtEvent'); if(!el)return;
    el.textContent=text; el.classList.add('show'); clearTimeout(announce.t);
    announce.t=setTimeout(()=>el.classList.remove('show'),3200);
  }
  function openPanel(){
    let modal=document.getElementById('dtAchievementsModal');
    if(!modal){
      modal=document.createElement('div'); modal.id='dtAchievementsModal';
      modal.innerHTML='<div class="dt-ach-card"><button class="dt-ach-close">×</button><h2>🏆 CONQUISTAS</h2><p>Desbloqueie objetivos e ganhe recompensas permanentes.</p><div id="dtAchList"></div></div>';
      document.body.appendChild(modal); modal.querySelector('.dt-ach-close').onclick=()=>modal.classList.remove('open');
    }
    modal.querySelector('#dtAchList').innerHTML=catalog.map(item=>{
      const ok=state.unlocked.includes(item.id);
      return `<div class="dt-ach ${ok?'done':''}"><div>${item.icon}</div><section><b>${item.name}</b><span>${item.desc}</span><small>${ok?'✅ DESBLOQUEADA':'🎁 '+item.reward}</small></section></div>`;
    }).join('');
    modal.classList.add('open');
  }
  function makeButton(){
    if(document.getElementById('dtAchievementsButton'))return;
    const b=document.createElement('button'); b.id='dtAchievementsButton'; b.textContent='🏆 CONQUISTAS'; b.onclick=openPanel; document.body.appendChild(b);
  }
  function inspect(){
    try{
      if(typeof jogadores==='undefined'||!Array.isArray(jogadores)||!jogadores.length)return;
      const p=jogadores[Number(jogadorAtual)||0]; if(!p)return;
      const h=Array.isArray(window.historico)?window.historico:[];
      if(h.length>lastHistory){
        const newEntries=h.slice(lastHistory);
        if(newEntries.some(x=>/acert|ganhou|corret/i.test(String(x)))) unlock('first-answer');
        lastHistory=h.length;
      }
      if(Number(p.pontos)>=10) unlock('ten-points');
      if(Number(p.posicao)>=60) unlock('halfway');
      if(Number(p.posicao)>=120) unlock('finish');
      if(Number(localStorage.getItem('dt_coins')||0)>=250) unlock('rich');
      if(window.__dtCardUsed) unlock('card-user');
      if(window.__dtChaosUsed) unlock('chaos');
      if(window.__dtGameFinished && !window.__dtAchGameCounted){
        window.__dtAchGameCounted=true; state.games++; save(); if(state.games>=3)unlock('three-games');
      }
      lastPos=Number(p.posicao)||lastPos;
    }catch(e){}
  }
  const style=document.createElement('style'); style.textContent=`
    #dtAchievementsButton{position:fixed;right:18px;bottom:64px;z-index:12001;border:1px solid #ffffff25;border-radius:12px;padding:10px 15px;background:#37245c;color:#fff;font-weight:1000;cursor:pointer;box-shadow:0 8px 24px #0008}
    #dtAchievementsModal{position:fixed;inset:0;z-index:16001;display:none;align-items:center;justify-content:center;background:#02060cea;padding:18px}
    #dtAchievementsModal.open{display:flex}.dt-ach-card{width:min(700px,96vw);max-height:88vh;overflow:auto;padding:28px;border-radius:24px;background:#0d1722;border:2px solid #ffffff20;color:#fff;position:relative}.dt-ach-card h2{margin:0 0 5px;color:#ffd34f}.dt-ach-card>p{color:#9fb0c2}.dt-ach-close{position:absolute;right:14px;top:8px;border:0;background:transparent;color:#fff;font-size:32px;cursor:pointer}.dt-ach{display:grid;grid-template-columns:50px 1fr;gap:12px;padding:12px;margin:8px 0;border:1px solid #ffffff12;border-radius:14px;background:#ffffff05}.dt-ach.done{border-color:#22c55e55;background:#22c55e0d}.dt-ach>div{font-size:30px;text-align:center}.dt-ach section{display:flex;flex-direction:column;gap:4px}.dt-ach span{font-size:12px;color:#aab8c8}.dt-ach small{font-weight:900;color:#ffd34f}
  `; document.head.appendChild(style); makeButton(); setInterval(inspect,1000);
})();
