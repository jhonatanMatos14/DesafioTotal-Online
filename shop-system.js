(() => {
  const KEY = 'dt_shop';
  const catalog = [
    {id:'skin-neon', name:'Skin Neon', icon:'🌃', price:100, desc:'Tema neon para o seu perfil.'},
    {id:'skin-fire', name:'Skin Fogo', icon:'🔥', price:180, desc:'Visual flamejante.'},
    {id:'dice-gold', name:'Dado Dourado', icon:'🎲', price:250, desc:'Dado especial para exibir no seu perfil.'},
    {id:'trail-light', name:'Rastro de Luz', icon:'✨', price:300, desc:'Efeito visual de movimento.'},
    {id:'title-master', name:'Título: Mestre', icon:'👑', price:500, desc:'Título especial no seu perfil.'},
    {id:'title-legend', name:'Título: Lenda', icon:'🏆', price:1000, desc:'Título raro para veteranos.'}
  ];
  let data = JSON.parse(localStorage.getItem(KEY) || '{}');
  data.owned = Array.isArray(data.owned) ? data.owned : [];
  data.selected = data.selected || null;

  const save = () => localStorage.setItem(KEY, JSON.stringify(data));
  const coins = () => Number(localStorage.getItem('dt_coins') || 0);
  const addCoins = n => localStorage.setItem('dt_coins', String(Math.max(0, coins() + n)));

  function render(){
    let modal = document.getElementById('dtShopModal');
    if(!modal){
      modal = document.createElement('div');
      modal.id='dtShopModal';
      modal.innerHTML=`<div class="dt-shop-card"><button class="dt-shop-close">×</button><div class="dt-shop-title">🛒 LOJA DO DESAFIO TOTAL</div><p class="dt-shop-sub">Use suas moedas para desbloquear itens cosméticos.</p><div class="dt-shop-balance">🪙 <span id="dtShopCoins">0</span> moedas</div><div id="dtShopItems" class="dt-shop-items"></div></div>`;
      document.body.appendChild(modal);
      modal.querySelector('.dt-shop-close').onclick=()=>modal.classList.remove('open');
    }
    modal.querySelector('#dtShopCoins').textContent=coins();
    const list=modal.querySelector('#dtShopItems');
    list.innerHTML=catalog.map(item=>{
      const owned=data.owned.includes(item.id);
      const selected=data.selected===item.id;
      return `<article class="dt-shop-item ${selected?'selected':''}"><div class="dt-shop-icon">${item.icon}</div><div class="dt-shop-info"><b>${item.name}</b><span>${item.desc}</span></div><button data-id="${item.id}" ${!owned && coins()<item.price?'disabled':''}>${selected?'EQUIPADO':owned?'EQUIPAR':`🪙 ${item.price}`}</button></article>`;
    }).join('');
    list.querySelectorAll('button').forEach(btn=>btn.onclick=()=>buyOrEquip(btn.dataset.id));
  }

  function buyOrEquip(id){
    const item=catalog.find(x=>x.id===id); if(!item)return;
    if(!data.owned.includes(id)){
      if(coins()<item.price)return;
      addCoins(-item.price);
      data.owned.push(id);
    }
    data.selected=id; save(); render();
    const hud=document.getElementById('dtCoins'); if(hud)hud.textContent=coins();
    announce(`✨ ${item.name} desbloqueado!`);
  }

  function announce(text){
    const el=document.getElementById('dtEvent');
    if(!el)return;
    el.textContent=text; el.classList.add('show');
    clearTimeout(announce.timer); announce.timer=setTimeout(()=>el.classList.remove('show'),2200);
  }

  function makeButton(){
    if(document.getElementById('dtShopButton'))return;
    const btn=document.createElement('button');
    btn.id='dtShopButton'; btn.textContent='🛒 LOJA'; btn.title='Abrir loja';
    btn.onclick=()=>{render();document.getElementById('dtShopModal').classList.add('open')};
    document.body.appendChild(btn);
  }

  const style=document.createElement('style');
  style.textContent=`
    #dtShopButton{position:fixed;right:18px;bottom:18px;z-index:12001;border:1px solid #ffffff25;border-radius:12px;padding:10px 15px;background:#17263a;color:#fff;font-weight:1000;cursor:pointer;box-shadow:0 8px 24px #0008}
    #dtShopModal{position:fixed;inset:0;z-index:16000;display:none;align-items:center;justify-content:center;background:#02060ce8;padding:18px}
    #dtShopModal.open{display:flex}.dt-shop-card{width:min(760px,96vw);max-height:90vh;overflow:auto;padding:28px;border-radius:24px;background:#0d1722;border:2px solid #ffffff20;box-shadow:0 30px 100px #000b;position:relative;color:#fff}.dt-shop-close{position:absolute;right:14px;top:10px;border:0;background:transparent;color:#fff;font-size:32px;cursor:pointer}.dt-shop-title{font-size:26px;font-weight:1000}.dt-shop-sub{color:#9fb0c2}.dt-shop-balance{display:inline-block;padding:8px 12px;border-radius:10px;background:#ffffff0d;font-weight:900;color:#ffd34f}.dt-shop-items{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}.dt-shop-item{display:grid;grid-template-columns:52px 1fr auto;gap:10px;align-items:center;padding:12px;border:1px solid #ffffff12;border-radius:14px;background:#ffffff06}.dt-shop-item.selected{border-color:#60a5fa}.dt-shop-icon{font-size:34px;text-align:center}.dt-shop-info{display:flex;flex-direction:column;gap:4px}.dt-shop-info span{font-size:11px;color:#9fb0c2}.dt-shop-item button{border:0;border-radius:9px;padding:8px 10px;background:#2563eb;color:#fff;font-weight:900;cursor:pointer}.dt-shop-item button:disabled{opacity:.4;cursor:not-allowed}@media(max-width:650px){.dt-shop-items{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);
  makeButton();
})();
