(() => {
  const KEY='dt_routes_v1';
  const milestones={30:{left:{to:34,label:'🟢 ROTA BÔNUS',desc:'Avance 4 casas e pegue o caminho seguro.'},right:{to:27,label:'🔴 ROTA DE RISCO',desc:'Recuo agora, mas você ganha 20 moedas.'}},60:{left:{to:66,label:'⚡ ATALHO',desc:'Avance 6 casas.'},right:{to:56,label:'💥 CAOS',desc:'Volte 4 casas, mas ganhe 40 moedas.'}},90:{left:{to:98,label:'🚀 TURBO',desc:'Avance 8 casas.'},right:{to:87,label:'🧠 ESTRATÉGIA',desc:'Volte 3 casas e ganhe 60 moedas.'}}};
  let used={}; try{used=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){used={}};
  let shown=false,lastKey='';
  function isHost(){return window.dtIsOnlineHost===true || typeof window.socket==='undefined' && !document.getElementById('onlineOverlay')?.style.display==='none'}
  function coins(n){const c=Math.max(0,Number(localStorage.getItem('dt_coins')||0)+n);localStorage.setItem('dt_coins',String(c));const el=document.getElementById('dtCoins');if(el)el.textContent=c;}
  function announce(t){const el=document.getElementById('dtEvent');if(!el)return;el.textContent=t;el.classList.add('show');clearTimeout(announce.t);announce.t=setTimeout(()=>el.classList.remove('show'),2500)}
  function choose(mark,opt){
    const p=jogadores[jogadorAtual]; if(!p)return;
    p.posicao=opt.to; coins(opt.to>mark ? 0 : 20);
    if(opt.to<mark) coins(mark===60?40:mark===90?60:20);
    used[mark]=true; localStorage.setItem(KEY,JSON.stringify(used));
    announce(`${opt.label}: ${opt.desc}`);
    if(typeof atualizarTodasAsPecas==='function')atualizarTodasAsPecas();
    if(typeof atualizarPlacar==='function')atualizarPlacar();
    if(typeof window.dtRefreshBoardVisual==='function')window.dtRefreshBoardVisual();
    shown=false;lastKey='';
  }
  function open(mark){
    const route=milestones[mark]; if(!route||used[mark]||shown)return;
    shown=true;lastKey=String(mark);
    const old=document.getElementById('dtRouteModal'); if(old)old.remove();
    const m=document.createElement('div');m.id='dtRouteModal';m.innerHTML=`<div class="dt-route-card"><div class="dt-route-kicker">🗺️ ESCOLHA SEU CAMINHO</div><h2>Casa ${mark}</h2><p>Você encontrou uma bifurcação. Escolha uma rota:</p><div class="dt-route-options"><button data-r="left"><b>${route.left.label}</b><span>${route.left.desc}</span></button><button data-r="right"><b>${route.right.label}</b><span>${route.right.desc}</span></button></div></div>`;document.body.appendChild(m);
    m.querySelectorAll('button').forEach(b=>b.onclick=()=>choose(mark,route[b.dataset.r]));
  }
  function inspect(){
    try{
      if(typeof jogadores==='undefined'||!Array.isArray(jogadores)||!jogadores.length)return;
      // No multiplayer, somente o host decide a rota para não gerar divergência entre clientes.
      if(document.getElementById('onlineOverlay') && window.dtOnlineStarted && !window.dtIsOnlineHost)return;
      const p=jogadores[Number(jogadorAtual)||0];if(!p)return;
      const pos=Number(p.posicao)||0;
      if(milestones[pos]&&!used[pos]&&window.dtIsOnlineHost!==false)open(pos);
    }catch(e){}
  }
  const style=document.createElement('style');style.textContent=`
    #dtRouteModal{position:fixed;inset:0;z-index:17000;display:flex;align-items:center;justify-content:center;background:#02060ced;padding:18px}.dt-route-card{width:min(650px,94vw);padding:30px;border-radius:26px;background:#0d1722;border:2px solid #60a5fa;color:#fff;box-shadow:0 30px 100px #000b;text-align:center}.dt-route-kicker{font-weight:1000;color:#60a5fa}.dt-route-card h2{font-size:34px;margin:8px 0}.dt-route-card p{color:#9fb0c2}.dt-route-options{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:20px}.dt-route-options button{min-height:130px;border:1px solid #ffffff18;border-radius:16px;background:#ffffff08;color:#fff;padding:18px;cursor:pointer;text-align:left}.dt-route-options button:hover{transform:translateY(-3px);border-color:#60a5fa;background:#ffffff12}.dt-route-options b,.dt-route-options span{display:block}.dt-route-options b{font-size:18px;margin-bottom:8px}.dt-route-options span{font-size:13px;color:#aab8c8;line-height:1.4}@media(max-width:650px){.dt-route-options{grid-template-columns:1fr}}
  `;document.head.appendChild(style);setInterval(inspect,500);
})();
