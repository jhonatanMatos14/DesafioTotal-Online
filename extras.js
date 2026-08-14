(() => {
  const socket = typeof io === 'function' ? io() : null;
  const EMOTES = ['😂','😱','🔥','👍','😡','🎉'];
  let xp = Number(localStorage.getItem('dt_xp') || 0);
  let coins = Number(localStorage.getItem('dt_coins') || 0);
  let level = Math.floor(xp / 100) + 1;
  let lastTurn = -1;
  let lastHistory = 0;

  const style = document.createElement('style');
  style.textContent = `
    #dtExtrasHud{position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:12000;display:flex;gap:8px;align-items:center;padding:8px 12px;border:1px solid #ffffff22;border-radius:16px;background:linear-gradient(135deg,#0b1726ee,#111827ee);box-shadow:0 10px 30px #0009;backdrop-filter:blur(8px);font-family:Arial,sans-serif}
    #dtExtrasHud .dt-pill{padding:7px 10px;border-radius:10px;background:#ffffff0d;font-weight:900;font-size:12px;color:#e5edf7;white-space:nowrap}
    #dtExtrasHud .dt-level{color:#ffd34f}.dt-xpbar{width:70px;height:6px;background:#0b1220;border-radius:99px;overflow:hidden;margin-top:4px}.dt-xpfill{height:100%;width:0;background:linear-gradient(90deg,#22c55e,#60a5fa);transition:width .4s}
    #dtEmotes{position:fixed;right:18px;bottom:88px;z-index:12000;display:flex;gap:6px;padding:7px;border:1px solid #ffffff22;border-radius:14px;background:#081321dd;box-shadow:0 8px 25px #0008}
    #dtEmotes button{width:38px;height:38px;border:0;border-radius:10px;background:#18283b;color:#fff;font-size:20px;cursor:pointer;transition:.15s}.dt-emote:hover{transform:translateY(-3px);background:#29425e}
    .dt-float-emote{position:fixed;z-index:13000;font-size:44px;pointer-events:none;animation:dtFloat 1.6s ease forwards;text-shadow:0 5px 12px #000}
    @keyframes dtFloat{0%{opacity:0;transform:translateY(20px) scale(.6)}20%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-110px) scale(1.25)}}
    #dtEvent{position:fixed;left:50%;top:92px;transform:translateX(-50%) translateY(-20px);z-index:11999;opacity:0;pointer-events:none;padding:12px 20px;border-radius:15px;border:2px solid #fbbf24;background:linear-gradient(135deg,#3b2206,#1b1205);color:#fff;font-weight:1000;box-shadow:0 12px 35px #000a;transition:.3s;text-align:center}
    #dtEvent.show{opacity:1;transform:translateX(-50%) translateY(0)}
    #dtVictory{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:#02060ce8;z-index:15000}.dt-victory-card{width:min(620px,92vw);padding:42px 28px;border-radius:30px;text-align:center;background:radial-gradient(circle at top,#2a4b31,#0d1722 65%);border:3px solid #ffd34f;box-shadow:0 30px 100px #000d}.dt-victory-card .cup{font-size:78px}.dt-victory-card h2{font-size:42px;margin:10px 0;color:#ffd34f}.dt-victory-card p{color:#d7e2ee;font-size:17px}.dt-victory-card button{margin-top:22px;padding:13px 22px;border:0;border-radius:12px;background:#22c55e;color:#fff;font-weight:1000;cursor:pointer}
    #dtMapSwitcher{position:fixed;left:18px;bottom:18px;z-index:12000;display:flex;gap:5px;padding:6px;border-radius:12px;background:#081321dd;border:1px solid #ffffff22}.dt-map{border:0;border-radius:8px;padding:7px 9px;background:#17263a;color:#dce8f5;font-size:11px;font-weight:900;cursor:pointer}.dt-map.active{outline:2px solid #60a5fa}
    body.dt-neon .tabuleiro{background:radial-gradient(circle,#19366f,#10173a 70%)}
    body.dt-space .tabuleiro{background:radial-gradient(circle at 50% 45%,#40206b,#0b1029 70%)}
    body.dt-arena .tabuleiro{background:radial-gradient(circle at 50% 50%,#2d7d31,#1e5b26 100%)}
    @media(max-width:700px){#dtExtrasHud{top:6px;max-width:96vw;overflow:auto}#dtEmotes{right:8px;bottom:75px}#dtMapSwitcher{left:8px;bottom:8px}.dt-pill{font-size:10px!important}}
  `;
  document.head.appendChild(style);

  function makeUI(){
    if(document.getElementById('dtExtrasHud')) return;
    const hud=document.createElement('div'); hud.id='dtExtrasHud';
    hud.innerHTML=`<div class="dt-pill dt-level">⭐ NÍVEL <span id="dtLevel">1</span><div class="dt-xpbar"><div id="dtXpFill" class="dt-xpfill"></div></div></div><div class="dt-pill">⚡ XP <span id="dtXp">0</span></div><div class="dt-pill">🪙 <span id="dtCoins">0</span></div>`;
    document.body.appendChild(hud);
    const em=document.createElement('div'); em.id='dtEmotes';
    EMOTES.forEach(e=>{const b=document.createElement('button');b.className='dt-emote';b.textContent=e;b.title='Enviar reação';b.onclick=()=>sendEmote(e);em.appendChild(b)});
    document.body.appendChild(em);
    const event=document.createElement('div');event.id='dtEvent';document.body.appendChild(event);
    const victory=document.createElement('div');victory.id='dtVictory';victory.innerHTML='<div class="dt-victory-card"><div class="cup">🏆</div><h2>VITÓRIA!</h2><p id="dtVictoryText">Você chegou ao final do tabuleiro!</p><button onclick="location.reload()">🔄 JOGAR NOVAMENTE</button></div>';document.body.appendChild(victory);
    const maps=document.createElement('div');maps.id='dtMapSwitcher';
    [['arena','🏟️ Arena'],['neon','🌃 Neon'],['space','🚀 Espaço']].forEach(([key,label])=>{const b=document.createElement('button');b.className='dt-map';b.dataset.map=key;b.textContent=label;b.onclick=()=>setMap(key);maps.appendChild(b)});
    document.body.appendChild(maps);
    setMap(localStorage.getItem('dt_map')||'arena'); updateHud();
  }

  function setMap(map){
    document.body.classList.remove('dt-arena','dt-neon','dt-space');
    document.body.classList.add('dt-'+map);localStorage.setItem('dt_map',map);
    document.querySelectorAll('.dt-map').forEach(b=>b.classList.toggle('active',b.dataset.map===map));
  }

  function updateHud(){
    level=Math.floor(xp/100)+1;
    const el=id=>document.getElementById(id); if(!el('dtLevel')) return;
    el('dtLevel').textContent=level;el('dtXp').textContent=xp;el('dtCoins').textContent=coins;el('dtXpFill').style.width=(xp%100)+'%';
  }
  function gain(x,c){xp=Math.max(0,xp+x);coins=Math.max(0,coins+c);localStorage.setItem('dt_xp',xp);localStorage.setItem('dt_coins',coins);updateHud()}
  function sendEmote(e){if(socket)socket.emit('partyEmote',{emoji:e})}
  function showEmote(e){const el=document.createElement('div');el.className='dt-float-emote';el.textContent=e;el.style.left=(15+Math.random()*70)+'vw';el.style.top=(35+Math.random()*35)+'vh';document.body.appendChild(el);setTimeout(()=>el.remove(),1600)}
  function announce(text){const el=document.getElementById('dtEvent');if(!el)return;el.textContent=text;el.classList.add('show');clearTimeout(announce.timer);announce.timer=setTimeout(()=>el.classList.remove('show'),2600)}

  if(socket){
    socket.on('partyEmote',data=>{if(data?.emoji)showEmote(data.emoji)});
    socket.on('partyAnnouncement',data=>{if(data?.text)announce(data.text)});
  }

  function inspectGame(){
    try{
      if(typeof jogadores==='undefined'||!Array.isArray(jogadores))return;
      const history=Array.isArray(window.historico)?window.historico:[];
      if(history.length>lastHistory){gain(Math.min(12,history.length-lastHistory)*5,Math.min(6,history.length-lastHistory)*2);lastHistory=history.length}
      if(typeof jogadorAtual!=='undefined'&&jogadorAtual!==lastTurn){
        lastTurn=jogadorAtual;
        if(jogadorAtual>0)gain(3,1);
      }
      jogadores.forEach((p,i)=>{if(Number(p.posicao)>=120 && !p.__dtWin){p.__dtWin=true;gain(50,25);const v=document.getElementById('dtVictory');const t=document.getElementById('dtVictoryText');if(v){t.textContent=`${p.nome} chegou à casa 120 e venceu a partida!`;v.style.display='flex'}}});
    }catch(e){}
  }

  makeUI();
  setInterval(inspectGame,500);
})();
