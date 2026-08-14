const telas = document.querySelectorAll(".tela");

const telaInicial = document.getElementById("telaInicial");
const telaJogadores = document.getElementById("telaJogadores");
const telaConfiguracao = document.getElementById("telaConfiguracao");
const telaComoJogar = document.getElementById("telaComoJogar");
const telaConfiguracoesMenu = document.getElementById("telaConfiguracoesMenu");
const telaTabuleiro = document.getElementById("telaTabuleiro");

const btnJogar = document.getElementById("btnJogar");
const btnComoJogar = document.getElementById("btnComoJogar");
const btnConfiguracoes = document.getElementById("btnConfiguracoes");
const btnVoltar = document.getElementById("btnVoltar");
const btnVoltarJogadores = document.getElementById("btnVoltarJogadores");
const btnVoltarInfo = document.getElementById("btnVoltarInfo");
const btnVoltarConfig = document.getElementById("btnVoltarConfig");
const btnComecarPartida = document.getElementById("btnComecarPartida");
const btnDado = document.getElementById("btnDado");
const btnReiniciar = document.getElementById("btnReiniciar");
const btnMenu = document.getElementById("btnMenu");

const listaJogadores = document.getElementById("listaJogadores");
const tabuleiro = document.getElementById("tabuleiro");
const jogadorDaVez = document.getElementById("jogadorDaVez");
const placar = document.getElementById("placar");
const dado = document.getElementById("dado");
const mensagemJogo = document.getElementById("mensagemJogo");
const historicoAcoes = document.getElementById("historicoAcoes");
const modalDesafio = document.getElementById("modalDesafio");
const textoDesafio = document.getElementById("textoDesafio");
const efeitoDesafio = document.getElementById("efeitoDesafio");
const opcoesDesafio = document.getElementById("opcoesDesafio");
const modalCarta = document.getElementById("modalCarta");
const textoCarta = document.getElementById("textoCarta");
const efeitoCarta = document.getElementById("efeitoCarta");
const btnUsarCarta = document.getElementById("btnUsarCarta");
const modalCaos = document.getElementById("modalCaos");
const textoCaos = document.getElementById("textoCaos");
const efeitoCaos = document.getElementById("efeitoCaos");
const btnConcluirCaos = document.getElementById("btnConcluirCaos");
let desafioAtual = null;
let jogadorDoDesafio = null;
const botoesQuantidade = document.querySelectorAll(".btnQuantidade");

const CORES = [
    "#ef4444", "#3b82f6", "#22c55e", "#eab308",
    "#a855f7", "#f97316", "#ec4899", "#06b6d4"
];

const FACES_DADO = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

const ICONES_BONECOS = ["⚽", "🎮", "🏆", "🤖", "🚀", "🥷", "🏎️", "🎧"];
const TEMAS_BONECOS = [
    "Craque do Futebol", "Pro Player", "Campeão", "Ciborgue",
    "Astronauta Gamer", "Ninja", "Piloto", "Streamer"
];


const PERGUNTAS = [
    { tema: "⚽ Futebol", pergunta: "Qual seleção venceu a Copa do Mundo de 2022?", opcoes: ["Brasil", "Argentina", "França", "Croácia"], correta: 1 },
    { tema: "⚽ Futebol", pergunta: "Quantos jogadores cada time começa em campo no futebol?", opcoes: ["9", "10", "11", "12"], correta: 2 },
    { tema: "⚽ Futebol", pergunta: "Qual clube é conhecido como Real Madrid?", opcoes: ["Barcelona", "Real Madrid", "Atlético de Madrid", "Sevilla"], correta: 1 },
    { tema: "⚽ Futebol", pergunta: "Em qual país nasceu Pelé?", opcoes: ["Brasil", "Argentina", "Portugal", "Uruguai"], correta: 0 },
    { tema: "⚽ Futebol", pergunta: "Quantos minutos dura o tempo regulamentar de uma partida de futebol, sem acréscimos?", opcoes: ["60", "80", "90", "100"], correta: 2 },
    { tema: "⚽ Futebol", pergunta: "Qual jogador é conhecido como 'Fenômeno'?", opcoes: ["Ronaldo", "Romário", "Kaká", "Rivaldo"], correta: 0 },
    { tema: "⚽ Futebol", pergunta: "Qual seleção tem o apelido de Canarinho?", opcoes: ["Brasil", "Colômbia", "Chile", "México"], correta: 0 },
    { tema: "⚽ Futebol", pergunta: "Qual cartão expulsa um jogador diretamente?", opcoes: ["Azul", "Amarelo", "Vermelho", "Verde"], correta: 2 },
    { tema: "⚽ Futebol", pergunta: "Quantas Copas do Mundo masculinas o Brasil conquistou até 2022?", opcoes: ["3", "4", "5", "6"], correta: 2 },
    { tema: "⚽ Futebol", pergunta: "Qual é a função principal do goleiro?", opcoes: ["Marcar escanteios", "Defender o gol", "Cobrar laterais", "Apitar o jogo"], correta: 1 },

    { tema: "🎮 Videogames", pergunta: "Qual empresa criou o Mario?", opcoes: ["Sony", "Nintendo", "Sega", "Microsoft"], correta: 1 },
    { tema: "🎮 Videogames", pergunta: "Qual é o nome do protagonista de The Legend of Zelda?", opcoes: ["Zelda", "Link", "Mario", "Ganondorf"], correta: 1 },
    { tema: "🎮 Videogames", pergunta: "Qual jogo ficou famoso pelo personagem Minecraft Steve?", opcoes: ["Minecraft", "Terraria", "Roblox", "Fortnite"], correta: 0 },
    { tema: "🎮 Videogames", pergunta: "Qual empresa fabrica o PlayStation?", opcoes: ["Microsoft", "Sony", "Nintendo", "Valve"], correta: 1 },
    { tema: "🎮 Videogames", pergunta: "Qual empresa fabrica o Xbox?", opcoes: ["Sony", "Nintendo", "Microsoft", "Sega"], correta: 2 },
    { tema: "🎮 Videogames", pergunta: "Em qual jogo aparece a ilha chamada Los Santos?", opcoes: ["GTA V", "FIFA", "Minecraft", "Forza Horizon"], correta: 0 },
    { tema: "🎮 Videogames", pergunta: "Qual personagem é o mascote clássico da Nintendo?", opcoes: ["Sonic", "Kratos", "Mario", "Master Chief"], correta: 2 },
    { tema: "🎮 Videogames", pergunta: "Qual jogo é conhecido pelo modo Battle Royale com construção?", opcoes: ["Fortnite", "FIFA", "The Sims", "Gran Turismo"], correta: 0 },
    { tema: "🎮 Videogames", pergunta: "Qual personagem usa a arma chamada Leviathan Axe?", opcoes: ["Kratos", "Link", "Sonic", "Geralt"], correta: 0 },
    { tema: "🎮 Videogames", pergunta: "Qual jogo de futebol da EA passou a se chamar EA Sports FC?", opcoes: ["PES", "FIFA", "Football Manager", "Rocket League"], correta: 1 },

    { tema: "🌎 Geral", pergunta: "Qual é a capital do Brasil?", opcoes: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"], correta: 2 },
    { tema: "🌎 Geral", pergunta: "Quantos dias tem um ano comum?", opcoes: ["360", "365", "366", "370"], correta: 1 },
    { tema: "🌎 Geral", pergunta: "Qual planeta é conhecido como Planeta Vermelho?", opcoes: ["Vênus", "Marte", "Júpiter", "Saturno"], correta: 1 },
    { tema: "🌎 Geral", pergunta: "Qual é o maior oceano da Terra?", opcoes: ["Atlântico", "Índico", "Pacífico", "Ártico"], correta: 2 },
    { tema: "🌎 Geral", pergunta: "Quantos continentes são tradicionalmente ensinados no modelo de 7 continentes?", opcoes: ["5", "6", "7", "8"], correta: 2 },
    { tema: "🌎 Geral", pergunta: "Qual é o símbolo químico da água?", opcoes: ["CO2", "H2O", "O2", "NaCl"], correta: 1 },
    { tema: "🌎 Geral", pergunta: "Qual animal é conhecido como o maior mamífero do planeta?", opcoes: ["Elefante", "Baleia-azul", "Girafa", "Hipopótamo"], correta: 1 },
    { tema: "🌎 Geral", pergunta: "Quantos lados tem um hexágono?", opcoes: ["5", "6", "7", "8"], correta: 1 },
    { tema: "🌎 Geral", pergunta: "Qual é o idioma oficial do Brasil?", opcoes: ["Espanhol", "Português", "Inglês", "Francês"], correta: 1 },
    { tema: "🌎 Geral", pergunta: "Qual estrela está no centro do nosso Sistema Solar?", opcoes: ["Sirius", "Lua", "Sol", "Polaris"], correta: 2 },

    { tema: "🏆 Misturado", pergunta: "Qual jogo tem o personagem Sonic?", opcoes: ["Sonic the Hedgehog", "Halo", "God of War", "Pokémon"], correta: 0 },
    { tema: "🏆 Misturado", pergunta: "Qual país é famoso pela Torre Eiffel?", opcoes: ["Itália", "França", "Espanha", "Alemanha"], correta: 1 },
    { tema: "🏆 Misturado", pergunta: "Qual seleção ganhou a Copa do Mundo de 2014?", opcoes: ["Brasil", "Argentina", "Alemanha", "Espanha"], correta: 2 },
    { tema: "🏆 Misturado", pergunta: "Qual console portátil é da Nintendo?", opcoes: ["Nintendo Switch", "Xbox Series S", "PS5", "Steam Deck"], correta: 0 },
    { tema: "🏆 Misturado", pergunta: "Qual é o maior planeta do Sistema Solar?", opcoes: ["Terra", "Saturno", "Júpiter", "Netuno"], correta: 2 },
    { tema: "🏆 Misturado", pergunta: "Qual clube brasileiro é conhecido como Timão?", opcoes: ["Corinthians", "Palmeiras", "Santos", "São Paulo"], correta: 0 },
    { tema: "🏆 Misturado", pergunta: "Qual jogo possui Poké Balls?", opcoes: ["Pokémon", "Minecraft", "FIFA", "GTA"], correta: 0 },
    { tema: "🏆 Misturado", pergunta: "Qual é o satélite natural da Terra?", opcoes: ["Marte", "Lua", "Sol", "Vênus"], correta: 1 },
    { tema: "🏆 Misturado", pergunta: "Qual jogador brasileiro é chamado de Rei do Futebol?", opcoes: ["Pelé", "Neymar", "Ronaldinho", "Cafu"], correta: 0 },
    { tema: "🏆 Misturado", pergunta: "Qual jogo de corrida é exclusivo das principais plataformas Xbox/PC?", opcoes: ["Forza Horizon", "Gran Turismo", "Mario Kart", "F1 Manager"], correta: 0 },

    { tema: "⚽ Futebol", pergunta: "Qual posição normalmente usa luvas e pode usar as mãos dentro da própria área?", opcoes: ["Atacante", "Goleiro", "Zagueiro", "Volante"], correta: 1 },
    { tema: "⚽ Futebol", pergunta: "Qual torneio reúne clubes da América do Sul?", opcoes: ["Libertadores", "Champions League", "Eurocopa", "Super Bowl"], correta: 0 },
    { tema: "⚽ Futebol", pergunta: "Qual é a cor tradicional do cartão que indica advertência?", opcoes: ["Azul", "Amarelo", "Verde", "Roxo"], correta: 1 },
    { tema: "⚽ Futebol", pergunta: "Qual país sediou a Copa do Mundo de 2014?", opcoes: ["Brasil", "Rússia", "França", "Japão"], correta: 0 },
    { tema: "⚽ Futebol", pergunta: "O que acontece em um pênalti?", opcoes: ["Tiro livre do meio", "Cobrança direta da marca de pênalti", "Escanteio", "Lateral"], correta: 1 },
    { tema: "⚽ Futebol", pergunta: "Qual clube é conhecido pelo apelido Verdão?", opcoes: ["Palmeiras", "Santos", "Grêmio", "Flamengo"], correta: 0 },
    { tema: "⚽ Futebol", pergunta: "Qual clube é conhecido como Peixe?", opcoes: ["Santos", "Corinthians", "Cruzeiro", "Bahia"], correta: 0 },
    { tema: "⚽ Futebol", pergunta: "Quantos pontos uma vitória vale no Campeonato Brasileiro?", opcoes: ["1", "2", "3", "4"], correta: 2 },
    { tema: "⚽ Futebol", pergunta: "Qual jogador brasileiro ficou famoso pelo apelido Bruxo?", opcoes: ["Ronaldinho Gaúcho", "Cafu", "Dida", "Roberto Carlos"], correta: 0 },
    { tema: "⚽ Futebol", pergunta: "Qual país ganhou a Copa do Mundo de 2018?", opcoes: ["França", "Croácia", "Alemanha", "Brasil"], correta: 0 },

    { tema: "🎮 Videogames", pergunta: "Qual personagem é um ouriço azul?", opcoes: ["Sonic", "Crash", "Kirby", "Pikachu"], correta: 0 },
    { tema: "🎮 Videogames", pergunta: "Qual jogo se passa principalmente em uma cidade chamada Night City?", opcoes: ["Cyberpunk 2077", "The Sims 4", "Minecraft", "FIFA 23"], correta: 0 },
    { tema: "🎮 Videogames", pergunta: "Qual franquia tem personagens como Pikachu e Charizard?", opcoes: ["Pokémon", "Halo", "Mortal Kombat", "Assassin's Creed"], correta: 0 },
    { tema: "🎮 Videogames", pergunta: "Qual personagem é o protagonista de God of War?", opcoes: ["Kratos", "Arthur Morgan", "Joel", "Ezio"], correta: 0 },
    { tema: "🎮 Videogames", pergunta: "Qual jogo de construção usa blocos e criaturas chamadas Creepers?", opcoes: ["Minecraft", "Fortnite", "Valorant", "Overwatch"], correta: 0 },
    { tema: "🎮 Videogames", pergunta: "Qual empresa criou o PlayStation?", opcoes: ["Sony", "Nintendo", "Valve", "Sega"], correta: 0 },
    { tema: "🎮 Videogames", pergunta: "Qual jogo tem partidas com agentes e bombas, como modo competitivo clássico?", opcoes: ["Counter-Strike", "The Sims", "Forza", "Minecraft"], correta: 0 },
    { tema: "🎮 Videogames", pergunta: "Qual franquia de corrida tem o personagem Mario em karts?", opcoes: ["Mario Kart", "Need for Speed", "Forza", "Gran Turismo"], correta: 0 },
    { tema: "🎮 Videogames", pergunta: "Qual console é associado à marca PlayStation?", opcoes: ["PS5", "Xbox Series X", "Switch", "Mega Drive"], correta: 0 },
    { tema: "🎮 Videogames", pergunta: "Qual jogo tem o modo Ultimate Team no futebol da EA?", opcoes: ["EA Sports FC", "Minecraft", "Halo", "Forza"], correta: 0 },

    { tema: "🌎 Geral", pergunta: "Qual é o maior país da América do Sul em território?", opcoes: ["Brasil", "Argentina", "Peru", "Chile"], correta: 0 },
    { tema: "🌎 Geral", pergunta: "Quantos minutos existem em uma hora?", opcoes: ["30", "45", "60", "90"], correta: 2 },
    { tema: "🌎 Geral", pergunta: "Qual é o metal cujo símbolo químico é Fe?", opcoes: ["Ferro", "Flúor", "Fósforo", "Frâncio"], correta: 0 },
    { tema: "🌎 Geral", pergunta: "Qual é o continente onde fica o Egito?", opcoes: ["África", "Europa", "Ásia", "Oceania"], correta: 0 },
    { tema: "🌎 Geral", pergunta: "Qual instrumento mede a temperatura?", opcoes: ["Barômetro", "Termômetro", "Bússola", "Higrômetro"], correta: 1 },
    { tema: "🌎 Geral", pergunta: "Qual é o resultado de 12 x 5?", opcoes: ["50", "55", "60", "65"], correta: 2 },
    { tema: "🌎 Geral", pergunta: "Qual órgão bombeia o sangue pelo corpo?", opcoes: ["Pulmão", "Coração", "Fígado", "Estômago"], correta: 1 },
    { tema: "🌎 Geral", pergunta: "Qual é o continente conhecido como Oceania?", opcoes: ["Onde fica a Austrália", "Onde fica o Brasil", "Onde fica o Egito", "Onde fica o Canadá"], correta: 0 },
    { tema: "🌎 Geral", pergunta: "Qual gás os seres humanos precisam respirar para sobreviver?", opcoes: ["Oxigênio", "Hélio", "Hidrogênio", "Metano"], correta: 0 },
    { tema: "🌎 Geral", pergunta: "Quantos lados tem um octógono?", opcoes: ["6", "7", "8", "9"], correta: 2 },

    { tema: "🏆 Misturado", pergunta: "Qual destes é um console da Microsoft?", opcoes: ["Xbox", "PlayStation", "Switch", "Dreamcast"], correta: 0 },
    { tema: "🏆 Misturado", pergunta: "Qual país é conhecido pelo samba e pelo futebol?", opcoes: ["Brasil", "Canadá", "Noruega", "Índia"], correta: 0 },
    { tema: "🏆 Misturado", pergunta: "Qual jogo é conhecido por partidas de 5 contra 5 com agentes?", opcoes: ["Valorant", "Mario Kart", "The Sims", "FIFA"], correta: 0 },
    { tema: "🏆 Misturado", pergunta: "Qual é a capital da França?", opcoes: ["Paris", "Roma", "Londres", "Berlim"], correta: 0 },
    { tema: "🏆 Misturado", pergunta: "Qual animal é símbolo conhecido de velocidade em Sonic?", opcoes: ["Ouriço", "Tigre", "Águia", "Cavalo"], correta: 0 },
    { tema: "🏆 Misturado", pergunta: "Qual seleção é conhecida como Albiceleste?", opcoes: ["Argentina", "Brasil", "Uruguai", "Chile"], correta: 0 },
    { tema: "🏆 Misturado", pergunta: "Qual jogo permite construir casas com blocos?", opcoes: ["Minecraft", "FIFA", "Forza", "Tekken"], correta: 0 },
    { tema: "🏆 Misturado", pergunta: "Qual é o planeta mais próximo do Sol?", opcoes: ["Mercúrio", "Vênus", "Terra", "Marte"], correta: 0 },
    { tema: "🏆 Misturado", pergunta: "Qual competição é associada ao troféu conhecido como Taça da Copa do Mundo?", opcoes: ["Copa do Mundo", "NBA", "Champions de xadrez", "Super Bowl"], correta: 0 },
    { tema: "🏆 Misturado", pergunta: "Qual destes é um jogo de sobrevivência e construção?", opcoes: ["Minecraft", "EA Sports FC", "Gran Turismo", "Street Fighter"], correta: 0 }
];

// 120 casas: distribuídas automaticamente para criar um tabuleiro caótico e variado.


// ==========================================================
// PERGUNTAS DIFÍCEIS — RECOMPENSA ALTA / PENALIDADE ALTA
// ==========================================================
const PERGUNTAS_DIFICEIS = [
    { tema: "⚽ Futebol • DIFÍCIL", pergunta: "Quem marcou o gol da Espanha na final da Copa do Mundo de 2010?", opcoes: ["Xavi", "David Villa", "Andrés Iniesta", "Fernando Torres"], correta: 2, dificuldade: "difícil" },
    { tema: "⚽ Futebol • DIFÍCIL", pergunta: "Qual seleção venceu a Copa do Mundo de 2006?", opcoes: ["França", "Itália", "Alemanha", "Brasil"], correta: 1, dificuldade: "difícil" },
    { tema: "⚽ Futebol • DIFÍCIL", pergunta: "Qual país sediou a Copa do Mundo de 1994?", opcoes: ["México", "Estados Unidos", "Itália", "França"], correta: 1, dificuldade: "difícil" },
    { tema: "⚽ Futebol • DIFÍCIL", pergunta: "Quem marcou o gol conhecido como 'La Mano de Dios' na Copa de 1986?", opcoes: ["Pelé", "Diego Maradona", "Jorge Valdano", "Gabriel Batistuta"], correta: 1, dificuldade: "difícil" },
    { tema: "⚽ Futebol • DIFÍCIL", pergunta: "Qual seleção foi campeã da Euro 2016?", opcoes: ["Portugal", "França", "Alemanha", "Espanha"], correta: 0, dificuldade: "difícil" },
    { tema: "⚽ Futebol • DIFÍCIL", pergunta: "Qual clube venceu a primeira edição da UEFA Champions League sob o nome de Liga dos Campeões, em 1993?", opcoes: ["Milan", "Olympique de Marseille", "Barcelona", "Ajax"], correta: 1, dificuldade: "difícil" },
    { tema: "⚽ Futebol • DIFÍCIL", pergunta: "Qual seleção conquistou a Copa América de 2021?", opcoes: ["Brasil", "Argentina", "Uruguai", "Colômbia"], correta: 1, dificuldade: "difícil" },
    { tema: "⚽ Futebol • DIFÍCIL", pergunta: "Em qual clube europeu Neymar jogou antes de se transferir para o Paris Saint-Germain?", opcoes: ["Real Madrid", "Barcelona", "Manchester City", "Juventus"], correta: 1, dificuldade: "difícil" },
    { tema: "⚽ Futebol • DIFÍCIL", pergunta: "Qual goleiro alemão ganhou a Bola de Ouro da Copa do Mundo de 2002?", opcoes: ["Oliver Kahn", "Manuel Neuer", "Jens Lehmann", "Marc-André ter Stegen"], correta: 0, dificuldade: "difícil" },
    { tema: "⚽ Futebol • DIFÍCIL", pergunta: "Qual seleção perdeu a final da Copa do Mundo de 1954 para a Alemanha Ocidental?", opcoes: ["Hungria", "Brasil", "Uruguai", "Áustria"], correta: 0, dificuldade: "difícil" },
    { tema: "⚽ Futebol • DIFÍCIL", pergunta: "Quem foi o artilheiro da Copa do Mundo de 2002?", opcoes: ["Rivaldo", "Ronaldo", "Miroslav Klose", "Ronaldinho"], correta: 1, dificuldade: "difícil" },
    { tema: "⚽ Futebol • DIFÍCIL", pergunta: "Qual país venceu a primeira Copa do Mundo, em 1930?", opcoes: ["Argentina", "Uruguai", "Brasil", "Itália"], correta: 1, dificuldade: "difícil" },
    { tema: "⚽ Futebol • DIFÍCIL", pergunta: "Qual clube brasileiro venceu a Copa Libertadores de 2012?", opcoes: ["Corinthians", "Santos", "São Paulo", "Internacional"], correta: 0, dificuldade: "difícil" },
    { tema: "⚽ Futebol • DIFÍCIL", pergunta: "Qual jogador recebeu o apelido de 'El Fenomeno' no futebol brasileiro e internacional?", opcoes: ["Ronaldo Nazário", "Romário", "Bebeto", "Adriano"], correta: 0, dificuldade: "difícil" },
    { tema: "⚽ Futebol • DIFÍCIL", pergunta: "Qual seleção eliminou o Brasil nas quartas de final da Copa de 2006?", opcoes: ["Argentina", "França", "Alemanha", "Itália"], correta: 1, dificuldade: "difícil" },
    { tema: "⚽ Futebol • DIFÍCIL", pergunta: "Qual país venceu a Copa do Mundo de 1978?", opcoes: ["Holanda", "Argentina", "Brasil", "Alemanha Ocidental"], correta: 1, dificuldade: "difícil" },
    { tema: "⚽ Futebol • DIFÍCIL", pergunta: "Quem marcou o gol da vitória da Inglaterra na final da Copa de 1966?", opcoes: ["Bobby Charlton", "Geoff Hurst", "Bobby Moore", "Kevin Keegan"], correta: 1, dificuldade: "difícil" },
    { tema: "⚽ Futebol • DIFÍCIL", pergunta: "Qual clube italiano é conhecido como 'La Vecchia Signora'?", opcoes: ["Milan", "Inter", "Juventus", "Roma"], correta: 2, dificuldade: "difícil" },
    { tema: "⚽ Futebol • DIFÍCIL", pergunta: "Qual seleção venceu a Eurocopa de 2004 em uma das maiores zebras da competição?", opcoes: ["Grécia", "Portugal", "República Tcheca", "Espanha"], correta: 0, dificuldade: "difícil" },
    { tema: "⚽ Futebol • DIFÍCIL", pergunta: "Qual clube brasileiro foi campeão mundial em 2005 após vencer o Liverpool?", opcoes: ["São Paulo", "Internacional", "Corinthians", "Santos"], correta: 0, dificuldade: "difícil" },

    { tema: "🎮 Videogames • DIFÍCIL", pergunta: "Qual estúdio desenvolveu Dark Souls?", opcoes: ["FromSoftware", "Capcom", "Konami", "Square Enix"], correta: 0, dificuldade: "difícil" },
    { tema: "🎮 Videogames • DIFÍCIL", pergunta: "Em que ano foi lançado o primeiro PlayStation no Japão?", opcoes: ["1992", "1994", "1996", "1998"], correta: 1, dificuldade: "difícil" },
    { tema: "🎮 Videogames • DIFÍCIL", pergunta: "Qual é o nome da cidade onde se passa principalmente Silent Hill 2?", opcoes: ["Raccoon City", "Silent Hill", "Midwich", "Arkham"], correta: 1, dificuldade: "difícil" },
    { tema: "🎮 Videogames • DIFÍCIL", pergunta: "Qual personagem é o protagonista de Red Dead Redemption 2?", opcoes: ["John Marston", "Arthur Morgan", "Dutch van der Linde", "Micah Bell"], correta: 1, dificuldade: "difícil" },
    { tema: "🎮 Videogames • DIFÍCIL", pergunta: "Qual empresa desenvolveu a série The Witcher?", opcoes: ["CD Projekt Red", "Ubisoft", "Bethesda", "Naughty Dog"], correta: 0, dificuldade: "difícil" },
    { tema: "🎮 Videogames • DIFÍCIL", pergunta: "Qual é o nome do protagonista de Hollow Knight?", opcoes: ["The Knight", "Hornet", "The Hollow", "Shade"], correta: 0, dificuldade: "difícil" },
    { tema: "🎮 Videogames • DIFÍCIL", pergunta: "Qual jogo introduziu originalmente o personagem Master Chief?", opcoes: ["Halo: Combat Evolved", "Halo 2", "Halo 3", "Halo Reach"], correta: 0, dificuldade: "difícil" },
    { tema: "🎮 Videogames • DIFÍCIL", pergunta: "Qual é o nome da protagonista de Horizon Zero Dawn?", opcoes: ["Aloy", "Ellie", "Ciri", "Kassandra"], correta: 0, dificuldade: "difícil" },
    { tema: "🎮 Videogames • DIFÍCIL", pergunta: "Qual estúdio criou The Last of Us?", opcoes: ["Naughty Dog", "Santa Monica Studio", "Insomniac Games", "Bungie"], correta: 0, dificuldade: "difícil" },
    { tema: "🎮 Videogames • DIFÍCIL", pergunta: "Qual franquia possui a região fictícia de Hyrule?", opcoes: ["Final Fantasy", "The Legend of Zelda", "Dragon Quest", "Kingdom Hearts"], correta: 1, dificuldade: "difícil" },
    { tema: "🎮 Videogames • DIFÍCIL", pergunta: "Qual é o nome da organização antagonista em Final Fantasy VII?", opcoes: ["Shinra", "Umbrella", "Abstergo", "Cerberus"], correta: 0, dificuldade: "difícil" },
    { tema: "🎮 Videogames • DIFÍCIL", pergunta: "Qual personagem é o protagonista de Sekiro: Shadows Die Twice?", opcoes: ["Wolf", "Genichiro", "Isshin", "Kuro"], correta: 0, dificuldade: "difícil" },
    { tema: "🎮 Videogames • DIFÍCIL", pergunta: "Qual jogo é conhecido pelo sistema Nemesis?", opcoes: ["Middle-earth: Shadow of Mordor", "Skyrim", "Fallout 4", "The Division"], correta: 0, dificuldade: "difícil" },
    { tema: "🎮 Videogames • DIFÍCIL", pergunta: "Qual console da Nintendo foi lançado antes do GameCube?", opcoes: ["Nintendo 64", "Wii", "Wii U", "Switch"], correta: 0, dificuldade: "difícil" },
    { tema: "🎮 Videogames • DIFÍCIL", pergunta: "Qual jogo da Valve usa o motor Source e acompanha Gordon Freeman?", opcoes: ["Half-Life 2", "Portal 2", "Left 4 Dead 2", "Counter-Strike 2"], correta: 0, dificuldade: "difícil" },
    { tema: "🎮 Videogames • DIFÍCIL", pergunta: "Qual personagem de Mortal Kombat é conhecido por usar um chapéu?", opcoes: ["Raiden", "Scorpion", "Sub-Zero", "Shao Kahn"], correta: 0, dificuldade: "difícil" },
    { tema: "🎮 Videogames • DIFÍCIL", pergunta: "Qual série de jogos tem a cidade de Rapture?", opcoes: ["BioShock", "Fallout", "Dead Space", "Dishonored"], correta: 0, dificuldade: "difícil" },
    { tema: "🎮 Videogames • DIFÍCIL", pergunta: "Qual é o nome da protagonista de Control?", opcoes: ["Jesse Faden", "Max Caulfield", "Faith Connors", "Emily Kaldwin"], correta: 0, dificuldade: "difícil" },
    { tema: "🎮 Videogames • DIFÍCIL", pergunta: "Qual jogo da Rockstar tem o protagonista Niko Bellic?", opcoes: ["GTA IV", "GTA V", "GTA San Andreas", "Red Dead Redemption"], correta: 0, dificuldade: "difícil" },
    { tema: "🎮 Videogames • DIFÍCIL", pergunta: "Qual franquia possui os personagens Samus Aran e Ridley?", opcoes: ["Metroid", "Star Fox", "F-Zero", "Kirby"], correta: 0, dificuldade: "difícil" },

    { tema: "🌎 Geral • DIFÍCIL", pergunta: "Qual é o número atômico do ouro (Au)?", opcoes: ["47", "79", "80", "82"], correta: 1, dificuldade: "difícil" },
    { tema: "🌎 Geral • DIFÍCIL", pergunta: "Qual é o maior planeta do Sistema Solar?", opcoes: ["Saturno", "Júpiter", "Netuno", "Urano"], correta: 1, dificuldade: "difícil" },
    { tema: "🌎 Geral • DIFÍCIL", pergunta: "Quem formulou as três leis do movimento clássico?", opcoes: ["Albert Einstein", "Isaac Newton", "Galileu Galilei", "Niels Bohr"], correta: 1, dificuldade: "difícil" },
    { tema: "🌎 Geral • DIFÍCIL", pergunta: "Qual é o elemento químico de símbolo W?", opcoes: ["Tungstênio", "Titânio", "Tálio", "Tório"], correta: 0, dificuldade: "difícil" },
    { tema: "🌎 Geral • DIFÍCIL", pergunta: "Qual é a capital da Mongólia?", opcoes: ["Astana", "Ulan Bator", "Tashkent", "Bishkek"], correta: 1, dificuldade: "difícil" },
    { tema: "🌎 Geral • DIFÍCIL", pergunta: "Qual é o rio mais longo da América do Sul?", opcoes: ["Paraná", "Amazonas", "Orinoco", "São Francisco"], correta: 1, dificuldade: "difícil" },
    { tema: "🌎 Geral • DIFÍCIL", pergunta: "Qual império construiu Machu Picchu?", opcoes: ["Asteca", "Inca", "Maia", "Olmeca"], correta: 1, dificuldade: "difícil" },
    { tema: "🌎 Geral • DIFÍCIL", pergunta: "Qual é o idioma com mais falantes nativos no mundo?", opcoes: ["Inglês", "Espanhol", "Mandarim", "Hindi"], correta: 2, dificuldade: "difícil" },
    { tema: "🌎 Geral • DIFÍCIL", pergunta: "Qual cientista propôs a teoria da evolução por seleção natural junto de Alfred Russel Wallace?", opcoes: ["Charles Darwin", "Gregor Mendel", "Louis Pasteur", "James Watson"], correta: 0, dificuldade: "difícil" },
    { tema: "🌎 Geral • DIFÍCIL", pergunta: "Qual é a unidade do Sistema Internacional para força?", opcoes: ["Joule", "Pascal", "Newton", "Watt"], correta: 2, dificuldade: "difícil" },
    { tema: "🌎 Geral • DIFÍCIL", pergunta: "Qual camada da atmosfera concentra a maior parte do ozônio atmosférico?", opcoes: ["Troposfera", "Estratosfera", "Mesosfera", "Termosfera"], correta: 1, dificuldade: "difícil" },
    { tema: "🌎 Geral • DIFÍCIL", pergunta: "Qual é o menor número primo?", opcoes: ["0", "1", "2", "3"], correta: 2, dificuldade: "difícil" },
    { tema: "🌎 Geral • DIFÍCIL", pergunta: "Qual é a raiz quadrada de 144?", opcoes: ["10", "11", "12", "14"], correta: 2, dificuldade: "difícil" },
    { tema: "🌎 Geral • DIFÍCIL", pergunta: "Qual país possui a maior extensão territorial do mundo?", opcoes: ["Canadá", "China", "Rússia", "Estados Unidos"], correta: 2, dificuldade: "difícil" },
    { tema: "🌎 Geral • DIFÍCIL", pergunta: "Qual é o símbolo químico do mercúrio?", opcoes: ["Mc", "Hg", "Me", "Mr"], correta: 1, dificuldade: "difícil" },
    { tema: "🌎 Geral • DIFÍCIL", pergunta: "Em que continente fica o deserto do Atacama?", opcoes: ["África", "Ásia", "América do Sul", "Oceania"], correta: 2, dificuldade: "difícil" },
    { tema: "🌎 Geral • DIFÍCIL", pergunta: "Qual filósofo escreveu 'A República'?", opcoes: ["Aristóteles", "Platão", "Sócrates", "Epicuro"], correta: 1, dificuldade: "difícil" },
    { tema: "🌎 Geral • DIFÍCIL", pergunta: "Qual planeta possui o período de rotação mais longo do Sistema Solar, considerando o sentido retrógrado de rotação?", opcoes: ["Vênus", "Mercúrio", "Marte", "Urano"], correta: 0, dificuldade: "difícil" },
    { tema: "🌎 Geral • DIFÍCIL", pergunta: "Qual é o maior órgão do corpo humano?", opcoes: ["Fígado", "Pele", "Pulmão", "Intestino"], correta: 1, dificuldade: "difícil" },
    { tema: "🌎 Geral • DIFÍCIL", pergunta: "Qual é a capital da Islândia?", opcoes: ["Oslo", "Helsinque", "Reykjavík", "Copenhague"], correta: 2, dificuldade: "difícil" }
];

// Junta as perguntas normais com as difíceis. As difíceis têm maior peso.
const PERGUNTAS_TODAS = [...PERGUNTAS, ...PERGUNTAS_DIFICEIS, ...PERGUNTAS_DIFICEIS];

const TOTAL_CASAS = 120;

// As casas especiais são sorteadas NOVAMENTE em toda partida.
// Mantemos uma quantidade parecida com a versão anterior, mas os lugares
// mudam para que cada partida tenha um tabuleiro diferente.
const CASAS_PERGUNTA = new Set();
const CASAS_DESAFIO = new Set();
const CASAS_CARTA = new Set();
const CASAS_BONUS = new Set();
const CASAS_PENALIDADE = new Set();
const CASAS_CAO = new Set();

const QUANTIDADE_CASAS = {
    pergunta: 22,
    desafio: 13,
    carta: 10,
    penalidade: 6,
    bonus: 6,
    caos: 7
};

function embaralhar(lista) {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function sortearCasasEspeciais() {
    CASAS_PERGUNTA.clear();
    CASAS_DESAFIO.clear();
    CASAS_CARTA.clear();
    CASAS_BONUS.clear();
    CASAS_PENALIDADE.clear();
    CASAS_CAO.clear();

    // Nunca colocamos evento na largada (1) nem na chegada (120).
    const disponiveis = embaralhar(
        Array.from({ length: TOTAL_CASAS - 2 }, (_, indice) => indice + 2)
    );
    let cursor = 0;

    const distribuir = (conjunto, quantidade) => {
        for (let i = 0; i < quantidade; i++) {
            conjunto.add(disponiveis[cursor++]);
        }
    };

    distribuir(CASAS_PERGUNTA, QUANTIDADE_CASAS.pergunta);
    distribuir(CASAS_DESAFIO, QUANTIDADE_CASAS.desafio);
    distribuir(CASAS_CARTA, QUANTIDADE_CASAS.carta);
    distribuir(CASAS_PENALIDADE, QUANTIDADE_CASAS.penalidade);
    distribuir(CASAS_BONUS, QUANTIDADE_CASAS.bonus);
    distribuir(CASAS_CAO, QUANTIDADE_CASAS.caos);
}

// Baralhos são embaralhados no início de cada partida. Assim, as perguntas
// não ficam repetindo enquanto ainda existem perguntas não utilizadas.
let baralhoPerguntas = [];
let indicePergunta = 0;
let baralhoDesafios = [];
let indiceDesafio = 0;

function prepararBaralhos() {
    baralhoPerguntas = embaralhar(PERGUNTAS_TODAS);
    indicePergunta = 0;
    baralhoDesafios = embaralhar(DESAFIOS);
    indiceDesafio = 0;
}

const DESAFIOS = [
    { tema: "⚽ FUTEBOL", pergunta: "Qual seleção ganhou a Copa do Mundo de 2006?", opcoes: ["Brasil", "Itália", "França", "Alemanha"], correta: 1, recompensa: 8, penalidade: 3, recuo: 2 },
    { tema: "⚽ FUTEBOL", pergunta: "Qual clube brasileiro é conhecido como Tricolor Paulista?", opcoes: ["São Paulo", "Fluminense", "Grêmio", "Bahia"], correta: 0, recompensa: 8, penalidade: 3, recuo: 2 },
    { tema: "⚽ FUTEBOL", pergunta: "Quem marcou o gol conhecido como 'La Mano de Dios' na Copa de 1986?", opcoes: ["Pelé", "Maradona", "Zidane", "Romário"], correta: 1, recompensa: 10, penalidade: 4, recuo: 3 },
    { tema: "⚽ FUTEBOL", pergunta: "Qual competição é disputada entre os principais clubes da Europa?", opcoes: ["Libertadores", "Champions League", "Copa América", "Eurocopa"], correta: 1, recompensa: 8, penalidade: 3, recuo: 2 },
    { tema: "⚽ FUTEBOL", pergunta: "Qual país sediou a Copa do Mundo de 2018?", opcoes: ["Rússia", "Qatar", "Alemanha", "México"], correta: 0, recompensa: 8, penalidade: 3, recuo: 2 },
    { tema: "🎮 GAMES", pergunta: "Qual empresa desenvolveu The Last of Us?", opcoes: ["Naughty Dog", "Valve", "Ubisoft", "Capcom"], correta: 0, recompensa: 10, penalidade: 4, recuo: 3 },
    { tema: "🎮 GAMES", pergunta: "Qual personagem é conhecido por usar a Master Sword?", opcoes: ["Kratos", "Link", "Cloud", "Sonic"], correta: 1, recompensa: 8, penalidade: 3, recuo: 2 },
    { tema: "🎮 GAMES", pergunta: "Em qual jogo encontramos a região de Kanto?", opcoes: ["Pokémon", "Final Fantasy", "Elden Ring", "Halo"], correta: 0, recompensa: 8, penalidade: 3, recuo: 2 },
    { tema: "🎮 GAMES", pergunta: "Qual personagem pertence à franquia God of War?", opcoes: ["Kratos", "Geralt", "Ezio", "Doom Slayer"], correta: 0, recompensa: 8, penalidade: 3, recuo: 2 },
    { tema: "🎮 GAMES", pergunta: "Qual empresa criou a franquia Halo?", opcoes: ["343 Industries", "Nintendo", "Valve", "Sega"], correta: 0, recompensa: 10, penalidade: 4, recuo: 3 },
    { tema: "🎮 GAMES", pergunta: "Qual jogo é conhecido por sua ilha chamada Fortnite?", opcoes: ["Fortnite", "Valorant", "Overwatch", "Apex Legends"], correta: 0, recompensa: 6, penalidade: 3, recuo: 2 },
    { tema: "🌎 GERAL", pergunta: "Qual é o elemento químico de número atômico 79?", opcoes: ["Prata", "Ouro", "Ferro", "Cobre"], correta: 1, recompensa: 10, penalidade: 4, recuo: 3 },
    { tema: "🌎 GERAL", pergunta: "Qual é a capital da Austrália?", opcoes: ["Sydney", "Melbourne", "Canberra", "Perth"], correta: 2, recompensa: 10, penalidade: 4, recuo: 3 },
    { tema: "🌎 GERAL", pergunta: "Qual planeta possui a Grande Mancha Vermelha?", opcoes: ["Marte", "Júpiter", "Saturno", "Netuno"], correta: 1, recompensa: 8, penalidade: 3, recuo: 2 },
    { tema: "🌎 GERAL", pergunta: "Quem escreveu Dom Quixote?", opcoes: ["Miguel de Cervantes", "Machado de Assis", "Dante", "Shakespeare"], correta: 0, recompensa: 10, penalidade: 4, recuo: 3 },
    { tema: "🌎 GERAL", pergunta: "Qual é o maior deserto quente do mundo?", opcoes: ["Saara", "Atacama", "Gobi", "Kalahari"], correta: 0, recompensa: 8, penalidade: 3, recuo: 2 },
    { tema: "🔥 CAOS ONLINE", pergunta: "Escolha a alternativa que contém apenas consoles da Nintendo.", opcoes: ["Switch e Wii", "PS5 e Wii", "Xbox e Switch", "PS4 e Xbox"], correta: 0, recompensa: 8, penalidade: 3, recuo: 2 },
    { tema: "🔥 CAOS ONLINE", pergunta: "Qual destas franquias NÃO é de futebol?", opcoes: ["EA Sports FC", "eFootball", "Forza", "Football Manager"], correta: 2, recompensa: 8, penalidade: 3, recuo: 2 },
    { tema: "🔥 CAOS ONLINE", pergunta: "Qual destes jogos NÃO é da Rockstar Games?", opcoes: ["GTA V", "Red Dead Redemption 2", "Bully", "The Witcher 3"], correta: 3, recompensa: 10, penalidade: 4, recuo: 3 },
    { tema: "🔥 CAOS ONLINE", pergunta: "Qual destes países NÃO fica na América do Sul?", opcoes: ["Chile", "Peru", "México", "Uruguai"], correta: 2, recompensa: 8, penalidade: 3, recuo: 2 }
];

const CARTAS_ESPECIAIS = [
    { nome: "🚀 AVANCE 3 CASAS", efeito: "Avance 3 casas.", cor: "verde", aplicar: jogador => jogador.posicao = Math.min(TOTAL_CASAS, jogador.posicao + 3) },
    { nome: "⚡ AVANCE 5 CASAS", efeito: "Avance 5 casas.", cor: "amarelo", aplicar: jogador => jogador.posicao = Math.min(TOTAL_CASAS, jogador.posicao + 5) },
    { nome: "↩️ VOLTE 3 CASAS", efeito: "Volte 3 casas.", cor: "vermelho", aplicar: jogador => jogador.posicao = Math.max(1, jogador.posicao - 3) },
    { nome: "⭐ GANHE 5 PONTOS", efeito: "Ganhe 5 pontos.", cor: "azul", aplicar: jogador => jogador.pontos += 5 },
    { nome: "🎲 JOGUE NOVAMENTE", efeito: "Você joga o dado novamente agora.", cor: "roxo", tipo: "novamente" },
    { nome: "🛡️ ESCUDO DA SORTE", efeito: "Fique protegido contra a próxima penalidade ou desafio.", cor: "dourado", tipo: "escudo" },
    { nome: "💰 ROUBE 3 PONTOS", efeito: "Roube 3 pontos de um adversário aleatório.", cor: "azul", tipo: "roubo" },
    { nome: "🔄 TROCA DE POSIÇÃO", efeito: "Troque de posição com o jogador mais próximo.", cor: "roxo", tipo: "troca" },
    { nome: "💣 CAOS TOTAL", efeito: "Volte 2 casas, mas ganhe 7 pontos.", cor: "vermelho", aplicar: jogador => { jogador.posicao = Math.max(1, jogador.posicao - 2); jogador.pontos += 7; } },
    { nome: "🏆 JOGADA DE OURO", efeito: "Ganhe 10 pontos.", cor: "dourado", aplicar: jogador => jogador.pontos += 10 }
];
const EVENTOS_CAO = [
    { nome: "💥 Todo mundo para trás!", efeito: "Todos os outros jogadores voltam 2 casas.", aplicar: (jogador) => jogadores.forEach(j => { if (j !== jogador) j.posicao = Math.max(1, j.posicao - 2); }) },
    { nome: "👑 Roubo do líder", efeito: "Você ganha 4 pontos e o jogador em primeiro perde 2 pontos.", aplicar: (jogador) => { const alvo = [...jogadores].filter(j => j !== jogador).sort((a,b) => b.posicao-a.posicao)[0]; jogador.pontos += 4; if (alvo) alvo.pontos = Math.max(0, alvo.pontos - 2); } },
    { nome: "⚡ Turbo", efeito: "Avance 4 casas imediatamente.", aplicar: jogador => jogador.posicao = Math.min(TOTAL_CASAS, jogador.posicao + 4) },
    { nome: "🌀 Teleporte caótico", efeito: "Você volta 2 casas, mas ganha 6 pontos.", aplicar: jogador => { jogador.posicao = Math.max(1, jogador.posicao - 2); jogador.pontos += 6; } },
    { nome: "☠️ Chuva de penalidades", efeito: "Todos os jogadores perdem 1 ponto. Você perde 1 ponto extra.", aplicar: jogador => { jogadores.forEach(j => j.pontos = Math.max(0, j.pontos - 1)); jogador.pontos = Math.max(0, jogador.pontos - 1); } },
    { nome: "🎲 Dado maluco", efeito: "Você ganha uma jogada extra.", tipo: "novamente", aplicar: () => {} },
    { nome: "🔄 Troca com o líder", efeito: "Troque de posição com o jogador que estiver mais à frente.", aplicar: jogador => { const alvo = [...jogadores].filter(j => j !== jogador).sort((a,b) => b.posicao-a.posicao)[0]; if (alvo) [jogador.posicao, alvo.posicao] = [alvo.posicao, jogador.posicao]; } },
    { nome: "⭐ Explosão de pontos", efeito: "Ganhe 8 pontos, mas volte 1 casa.", aplicar: jogador => { jogador.pontos += 8; jogador.posicao = Math.max(1, jogador.posicao - 1); } }
];

let perguntaAtual = null;

let quantidadeJogadores = 0;
let jogadores = [];
let jogadorAtual = 0;
let partidaTerminou = false;
let caminhoTabuleiro = [];
let historico = [];

function mostrarTela(tela) {
    telas.forEach(t => t.classList.remove("ativa"));
    tela.classList.add("ativa");
}

btnJogar.addEventListener("click", () => {
    mostrarTela(telaJogadores);
});

btnComoJogar.addEventListener("click", () => {
    mostrarTela(telaComoJogar);
});

btnConfiguracoes.addEventListener("click", () => {
    mostrarTela(telaConfiguracoesMenu);
});

btnVoltar.addEventListener("click", () => {
    mostrarTela(telaInicial);
});

btnVoltarInfo.addEventListener("click", () => {
    mostrarTela(telaInicial);
});

btnVoltarConfig.addEventListener("click", () => {
    mostrarTela(telaInicial);
});

botoesQuantidade.forEach(botao => {
    botao.addEventListener("click", () => {
        quantidadeJogadores = Number(botao.dataset.jogadores);
        criarJogadores();
        mostrarTela(telaConfiguracao);
    });
});

function criarJogadores() {
    listaJogadores.innerHTML = "";

    for (let i = 0; i < quantidadeJogadores; i++) {
        const jogador = document.createElement("div");
        jogador.className = "jogador-config";

        jogador.innerHTML = `
            <span class="cor-jogador" style="background:${CORES[i]}"></span>
            <label for="nome-${i}">Jogador ${i + 1}</label>
            <input
                id="nome-${i}"
                type="text"
                class="nome-jogador"
                placeholder="Digite o nome"
                maxlength="20"
                autocomplete="off"
            >
        `;

        listaJogadores.appendChild(jogador);
    }

    const primeiro = listaJogadores.querySelector("input");
    if (primeiro) primeiro.focus();
}

btnVoltarJogadores.addEventListener("click", () => {
    mostrarTela(telaJogadores);
});

btnComecarPartida.addEventListener("click", iniciarPartida);

function iniciarPartida() {
    const campos = document.querySelectorAll(".nome-jogador");

    jogadores = Array.from(campos).map((campo, index) => ({
        nome: campo.value.trim() || `Jogador ${index + 1}`,
        cor: CORES[index],
        posicao: 1,
        pontos: 0,
        escudo: false
    }));

    jogadorAtual = 0;
    partidaTerminou = false;
    perguntaAtual = null;
    desafioAtual = null;
    jogadorDoDesafio = null;

    // Cada nova partida recebe perguntas em uma ordem nova e um novo desenho
    // de casas especiais. Nada fica preso ao tabuleiro da partida anterior.
    prepararBaralhos();
    sortearCasasEspeciais();

    dado.textContent = "🎲";
    btnDado.disabled = false;
    historico = [];
    renderHistorico();

    criarTabuleiro();
    atualizarPlacar();
    atualizarJogador();
    mensagemJogo.textContent = "Começou! Jogue o dado.";
    mostrarTela(telaTabuleiro);
}

function criarCaminho() {
    // Caminho em espiral com 120 casas em um grid 16 x 10.
    // As três voltas externas formam o caminho e deixam o centro livre.
    const caminho = [];
    const colunas = 16;
    const linhas = 10;
    let topo = 1;
    let baixo = linhas;
    let esquerda = 1;
    let direita = colunas;

    while (caminho.length < TOTAL_CASAS && topo <= baixo && esquerda <= direita) {
        for (let x = esquerda; x <= direita && caminho.length < TOTAL_CASAS; x++) {
            caminho.push({ x, y: topo });
        }
        topo++;

        for (let y = topo; y <= baixo && caminho.length < TOTAL_CASAS; y++) {
            caminho.push({ x: direita, y });
        }
        direita--;

        if (topo <= baixo) {
            for (let x = direita; x >= esquerda && caminho.length < TOTAL_CASAS; x--) {
                caminho.push({ x, y: baixo });
            }
            baixo--;
        }

        if (esquerda <= direita) {
            for (let y = baixo; y >= topo && caminho.length < TOTAL_CASAS; y--) {
                caminho.push({ x: esquerda, y });
            }
            esquerda++;
        }
    }

    // Começa no canto superior esquerdo e entra em espiral.
    // Com 16x10, exatamente 120 posições completam três voltas,
    // deixando uma área central livre para a decoração do tabuleiro.
    return caminho;
}

function criarTabuleiro() {
    tabuleiro.innerHTML = "";
    caminhoTabuleiro = criarCaminho();

    for (let i = 1; i <= TOTAL_CASAS; i++) {
        const casa = document.createElement("div");
        casa.className = "casa";
        casa.dataset.posicao = i;

        if (i === 1) {
            casa.classList.add("inicio");
            casa.innerHTML = "🏁<small>1</small>";
        } else if (i === TOTAL_CASAS) {
            casa.classList.add("chegada");
            casa.innerHTML = `🏆<small>${TOTAL_CASAS}</small>`;
        } else {
            casa.textContent = i;
            if (CASAS_PERGUNTA.has(i)) {
                casa.classList.add("casa-pergunta");
                casa.title = "Casa de pergunta";
                casa.innerHTML = `<span class="icone-pergunta">?</span>`;
            } else if (CASAS_DESAFIO.has(i)) {
                casa.classList.add("casa-desafio");
                casa.title = "Casa de desafio";
                casa.innerHTML = `<span class="icone-desafio">🔥</span>`;
            } else if (CASAS_CARTA.has(i)) {
                casa.classList.add("casa-carta");
                casa.title = "Carta especial";
                casa.innerHTML = `<span>★</span>`;
            } else if (CASAS_BONUS.has(i)) {
                casa.classList.add("casa-bonus");
                casa.title = "Pontos extras";
                casa.innerHTML = `<span>★</span>`;
            } else if (CASAS_PENALIDADE.has(i)) {
                casa.classList.add("casa-penalidade");
                casa.title = "Penalidade";
                casa.innerHTML = `<span>☠</span>`;
            } else if (CASAS_CAO.has(i)) {
                casa.classList.add("casa-caos");
                casa.title = "Evento Caos Total";
                casa.innerHTML = `<span>💥</span>`;
            } else {
                casa.textContent = i;
            }
        }

        const posicao = caminhoTabuleiro[i - 1];
        casa.style.gridColumn = posicao.x;
        casa.style.gridRow = posicao.y;

        tabuleiro.appendChild(casa);
    }
}

btnDado.addEventListener("click", jogarDado);

function jogarDado() {
    if (partidaTerminou || jogadores.length === 0) return;

    btnDado.disabled = true;

    dado.classList.remove("girando");
    void dado.offsetWidth;
    dado.classList.add("girando");

    const resultado = Math.floor(Math.random() * 6) + 1;
    dado.textContent = FACES_DADO[resultado - 1];

    const jogador = jogadores[jogadorAtual];
    const posicaoAnterior = jogador.posicao;

    jogador.posicao = Math.min(TOTAL_CASAS, jogador.posicao + resultado);
    jogador.pontos += resultado;

    mensagemJogo.textContent =
        `${jogador.nome} tirou ${resultado} e foi da casa ${posicaoAnterior} para a casa ${jogador.posicao}.`;
    registrarAcao(jogador, `tirou ${resultado} e foi para a casa ${jogador.posicao}`);

    atualizarPlacar();
    animarMovimento(posicaoAnterior, jogador.posicao, () => {
        if (jogador.posicao === TOTAL_CASAS) {
            finalizarPartida(jogador);
            return;
        }

        if (CASAS_PERGUNTA.has(jogador.posicao)) {
            abrirPergunta(jogador);
            return;
        }

        if (CASAS_DESAFIO.has(jogador.posicao)) {
            abrirDesafio(jogador);
            return;
        }

        if (CASAS_CARTA.has(jogador.posicao)) {
            abrirCarta(jogador);
            return;
        }

        if (CASAS_BONUS.has(jogador.posicao)) {
            jogador.pontos += 3;
            mensagemJogo.textContent = `⭐ ${jogador.nome} ganhou 3 pontos!`;
            registrarAcao(jogador, "ganhou 3 pontos no bônus");
            atualizarPlacar();
        } else if (CASAS_PENALIDADE.has(jogador.posicao)) {
            aplicarPenalidade(jogador);
            if (jogador.posicao <= 1 && jogador.pontos < 0) jogador.pontos = 0;
            atualizarPlacar();
            atualizarTodasAsPecas();
        } else if (CASAS_CAO.has(jogador.posicao)) {
            abrirCaos(jogador);
            return;
        }

        passarVez();
    });
}

function passarVez() {
    jogadorAtual = (jogadorAtual + 1) % jogadores.length;
    atualizarJogador();
    atualizarPlacar();
    btnDado.disabled = false;
    mensagemJogo.textContent += ` Agora é a vez de ${jogadores[jogadorAtual].nome}.`;
}

function abrirPergunta(jogador) {
    // Pega a próxima pergunta do baralho embaralhado. Quando acabar,
    // embaralha tudo de novo para permitir partidas longas.
    if (indicePergunta >= baralhoPerguntas.length) {
        baralhoPerguntas = embaralhar(PERGUNTAS_TODAS);
        indicePergunta = 0;
    }
    perguntaAtual = baralhoPerguntas[indicePergunta++];

    const tema = document.getElementById('temaPergunta');
    const texto = document.getElementById('textoPergunta');
    const regra = document.getElementById('regraPergunta');
    const opcoes = document.getElementById('opcoesPergunta');
    const modal = document.getElementById('modalPergunta');

    const dificil = perguntaAtual.dificuldade === 'difícil';
    const recompensa = dificil ? 10 : 5;
    const penalidade = dificil ? 5 : 3;
    const recuo = dificil ? 3 : 2;
    tema.textContent = `${perguntaAtual.tema}${dificil ? ' • 🧠 DIFÍCIL' : ''}`;
    regra.textContent = `Acertou: +${recompensa} • Errou: -${penalidade} e -${recuo} casas`;
    texto.textContent = perguntaAtual.pergunta;
    opcoes.innerHTML = '';

    perguntaAtual.opcoes.forEach((opcao, index) => {
        const botao = document.createElement('button');
        botao.className = 'opcao-pergunta';
        botao.textContent = `${String.fromCharCode(65 + index)}) ${opcao}`;
        botao.addEventListener('click', () => responderPergunta(index, jogador));
        opcoes.appendChild(botao);
    });

    modal.classList.add('aberta');
    mensagemJogo.textContent = `${jogador.nome} caiu em uma casa de pergunta! Responda para continuar.`;
}

function responderPergunta(indice, jogador) {
    const opcoes = document.querySelectorAll('.opcao-pergunta');
    opcoes.forEach(botao => botao.disabled = true);

    const acertou = indice === perguntaAtual.correta;
    opcoes[indice].classList.add(acertou ? 'correta' : 'errada');
    if (!acertou) opcoes[perguntaAtual.correta].classList.add('correta');

    if (acertou) {
        const recompensa = perguntaAtual.dificuldade === 'difícil' ? 10 : 5;
        jogador.pontos += recompensa;
        mensagemJogo.textContent = `✅ ${jogador.nome} acertou! +${recompensa} pontos${perguntaAtual.dificuldade === 'difícil' ? ' e recompensa de dificuldade!' : ''}`;
        registrarAcao(jogador, `acertou a pergunta e ganhou ${recompensa} pontos`);
    } else {
        // TODA pergunta tem penalidade quando a resposta estiver errada.
        // A dificuldade pode aumentar a punição, mas nunca deixa o erro sem consequência.
        const penalidade = perguntaAtual.dificuldade === 'difícil' ? 5 : 3;
        const recuo = perguntaAtual.dificuldade === 'difícil' ? 3 : 2;
        jogador.pontos = Math.max(0, jogador.pontos - penalidade);
        jogador.posicao = Math.max(1, jogador.posicao - recuo);

        mensagemJogo.textContent = `❌ ${jogador.nome} errou! -${penalidade} pontos e voltou ${recuo} casas. Correta: ${perguntaAtual.opcoes[perguntaAtual.correta]}.`;
        registrarAcao(jogador, `errou pergunta: -${penalidade} pontos e voltou ${recuo} casas`);
        atualizarTodasAsPecas();
    }

    atualizarPlacar();

    setTimeout(() => {
        document.getElementById('modalPergunta').classList.remove('aberta');
        perguntaAtual = null;
        passarVez();
    }, 900);
}

function abrirDesafio(jogador) {
    if (indiceDesafio >= baralhoDesafios.length) {
        baralhoDesafios = embaralhar(DESAFIOS);
        indiceDesafio = 0;
    }
    desafioAtual = baralhoDesafios[indiceDesafio++];
    jogadorDoDesafio = jogador;
    textoDesafio.textContent = desafioAtual.pergunta;
    efeitoDesafio.textContent = `🎯 ${desafioAtual.tema} • Acerte: +${desafioAtual.recompensa} pontos | Erre: -${desafioAtual.penalidade} pontos e recue ${desafioAtual.recuo} casas.`;
    opcoesDesafio.innerHTML = "";

    desafioAtual.opcoes.forEach((opcao, index) => {
        const botao = document.createElement("button");
        botao.className = "opcao-desafio";
        botao.textContent = `${String.fromCharCode(65 + index)}) ${opcao}`;
        botao.addEventListener("click", () => responderDesafio(index));
        opcoesDesafio.appendChild(botao);
    });

    modalDesafio.classList.add("aberta");
    mensagemJogo.textContent = `${jogador.nome} caiu em um desafio online! Escolha uma resposta.`;
    registrarAcao(jogador, "caiu em um desafio online");
}

function responderDesafio(indice) {
    if (!desafioAtual || !jogadorDoDesafio) return;

    const jogador = jogadorDoDesafio;
    const botoes = [...opcoesDesafio.querySelectorAll("button")];
    botoes.forEach(b => b.disabled = true);
    botoes[indice]?.classList.add(indice === desafioAtual.correta ? "correta" : "errada");
    botoes[desafioAtual.correta]?.classList.add("correta");

    const acertou = indice === desafioAtual.correta;
    const posicaoAntes = jogador.posicao;
    let protegido = false;

    if (jogador.escudo && !acertou) {
        jogador.escudo = false;
        protegido = true;
    }

    if (acertou) {
        jogador.pontos += desafioAtual.recompensa;
        mensagemJogo.textContent = `🔥 ACERTOU! ${jogador.nome} ganhou +${desafioAtual.recompensa} pontos!`;
        registrarAcao(jogador, `acertou desafio online e ganhou ${desafioAtual.recompensa} pontos`);
    } else if (protegido) {
        mensagemJogo.textContent = `🛡️ ${jogador.nome} errou, mas o Escudo da Sorte anulou a penalidade!`;
        registrarAcao(jogador, "errou desafio, mas usou o escudo");
    } else {
        jogador.pontos = Math.max(0, jogador.pontos - desafioAtual.penalidade);
        jogador.posicao = Math.max(1, jogador.posicao - desafioAtual.recuo);
        mensagemJogo.textContent = `❌ ERROU! -${desafioAtual.penalidade} pontos e voltou ${desafioAtual.recuo} casas.`;
        registrarAcao(jogador, `errou desafio online: -${desafioAtual.penalidade} pontos e voltou ${desafioAtual.recuo} casas`);
    }

    atualizarPlacar();
    atualizarTodasAsPecas();

    setTimeout(() => {
        modalDesafio.classList.remove("aberta");
        const venceu = jogador.posicao === TOTAL_CASAS;
        desafioAtual = null;
        jogadorDoDesafio = null;
        if (venceu) {
            finalizarPartida(jogador);
        } else {
            passarVez();
        }
    }, 1200);
}

function abrirCarta(jogador) {
    const carta = CARTAS_ESPECIAIS[Math.floor(Math.random() * CARTAS_ESPECIAIS.length)];
    jogador.cartaAtual = carta;
    textoCarta.textContent = carta.nome;
    efeitoCarta.textContent = carta.efeito;
    modalCarta.classList.add("aberta");
    mensagemJogo.textContent = `🃏 ${jogador.nome} tirou uma carta especial!`;
}

btnUsarCarta.addEventListener("click", () => {
    const jogador = jogadores[jogadorAtual];
    const carta = jogador?.cartaAtual;
    if (!carta) return;

    const antes = jogador.posicao;
    let jogadaExtra = false;

    if (carta.tipo === "novamente") {
        jogadaExtra = true;
    } else if (carta.tipo === "escudo") {
        jogador.escudo = true;
    } else if (carta.tipo === "roubo") {
        const adversarios = jogadores.filter((_, i) => i !== jogadorAtual);
        if (adversarios.length) {
            const alvo = adversarios[Math.floor(Math.random() * adversarios.length)];
            const roubado = Math.min(3, alvo.pontos);
            alvo.pontos -= roubado;
            jogador.pontos += roubado;
            mensagemJogo.textContent = `💰 ${jogador.nome} roubou ${roubado} pontos de ${alvo.nome}!`;
        }
    } else if (carta.tipo === "troca") {
        const adversarios = jogadores.filter((_, i) => i !== jogadorAtual);
        if (adversarios.length) {
            adversarios.sort((a,b) => Math.abs(a.posicao - jogador.posicao) - Math.abs(b.posicao - jogador.posicao));
            const alvo = adversarios[0];
            [jogador.posicao, alvo.posicao] = [alvo.posicao, jogador.posicao];
            mensagemJogo.textContent = `🔄 ${jogador.nome} trocou de posição com ${alvo.nome}!`;
        }
    } else {
        carta.aplicar(jogador);
    }

    jogador.cartaAtual = null;
    modalCarta.classList.remove("aberta");
    atualizarPlacar();
    atualizarTodasAsPecas();
    registrarAcao(jogador, `usou a carta ${carta.nome.replace(/^[^A-Z0-9À-ÿ]+/, "")}`);

    if (jogador.posicao >= TOTAL_CASAS) {
        jogador.posicao = TOTAL_CASAS;
        finalizarPartida(jogador);
        return;
    }

    if (jogadaExtra) {
        btnDado.disabled = false;
        mensagemJogo.textContent = `🎲 ${jogador.nome} joga novamente!`;
        return;
    }

    setTimeout(passarVez, 350);
});

function abrirCaos(jogador) {
    const evento = EVENTOS_CAO[Math.floor(Math.random() * EVENTOS_CAO.length)];
    jogador.eventoCaosAtual = evento;
    textoCaos.textContent = evento.nome;
    efeitoCaos.textContent = evento.efeito;
    modalCaos.classList.add("aberta");
    mensagemJogo.textContent = `💥 ${jogador.nome} caiu em uma casa de Caos Total!`;
}

btnConcluirCaos.addEventListener("click", () => {
    const jogador = jogadores[jogadorAtual];
    const evento = jogador?.eventoCaosAtual;
    if (!jogador || !evento) return;

    const posicaoAntes = jogador.posicao;
    evento.aplicar(jogador);
    modalCaos.classList.remove("aberta");
    jogador.eventoCaosAtual = null;

    atualizarPlacar();
    atualizarTodasAsPecas();
    registrarAcao(jogador, `ativou ${evento.nome.replace(/^[^A-ZÀ-ÿ0-9]+/, "")}`);

    if (jogador.posicao >= TOTAL_CASAS) {
        jogador.posicao = TOTAL_CASAS;
        finalizarPartida(jogador);
        return;
    }

    mensagemJogo.textContent = `💥 ${jogador.nome}: ${evento.efeito}`;
    if (posicaoAntes !== jogador.posicao) mensagemJogo.textContent += ` Casa ${posicaoAntes} → ${jogador.posicao}.`;

    if (evento.tipo === "novamente") {
        btnDado.disabled = false;
        mensagemJogo.textContent += " Você joga novamente!";
        return;
    }

    setTimeout(passarVez, 450);
});

function aplicarPenalidade(jogador) {
    if (jogador.escudo) {
        jogador.escudo = false;
        mensagemJogo.textContent = `🛡️ ${jogador.nome} usou o Escudo da Sorte e escapou da penalidade!`;
        registrarAcao(jogador, "usou o escudo e escapou da penalidade");
        return;
    }

    const efeitos = [
        () => { jogador.pontos = Math.max(0, jogador.pontos - 3); return "perdeu 3 pontos"; },
        () => { jogador.pontos = Math.max(0, jogador.pontos - 5); return "perdeu 5 pontos"; },
        () => { jogador.posicao = Math.max(1, jogador.posicao - 2); return "voltou 2 casas"; },
        () => { jogador.posicao = Math.max(1, jogador.posicao - 4); return "voltou 4 casas"; },
        () => { jogador.pontos = Math.max(0, jogador.pontos - 2); jogador.posicao = Math.max(1, jogador.posicao - 2); return "perdeu 2 pontos e voltou 2 casas"; }
    ];
    const resultado = efeitos[Math.floor(Math.random() * efeitos.length)]();
    mensagemJogo.textContent = `☠️ ${jogador.nome} ${resultado}!`;
    registrarAcao(jogador, resultado);
}

function animarMovimento(inicio, fim, callback) {
    let posicao = inicio;

    if (inicio === fim) {
        atualizarTodasAsPecas();
        callback();
        return;
    }

    const passo = inicio < fim ? 1 : -1;

    const intervalo = setInterval(() => {
        posicao += passo;
        jogadores[jogadorAtual].posicaoVisual = posicao;
        atualizarTodasAsPecas();

        if (posicao === fim) {
            clearInterval(intervalo);
            jogadores[jogadorAtual].posicaoVisual = undefined;
            callback();
        }
    }, 120);
}

function atualizarJogador() {
    if (!jogadores[jogadorAtual]) return;

    jogadorDaVez.textContent =
        `Vez de: ${jogadores[jogadorAtual].nome}`;

    atualizarTodasAsPecas();
}

function atualizarTodasAsPecas() {
    document.querySelectorAll(".peca-jogador").forEach(p => p.remove());

    jogadores.forEach((jogador, index) => {
        const posicao = jogador.posicaoVisual || jogador.posicao;
        const casa = tabuleiro.querySelector(`[data-posicao="${posicao}"]`);

        if (!casa) return;

        const peca = document.createElement("div");
        peca.className = "peca-jogador boneco-25d";
        peca.style.setProperty("--cor-jogador", jogador.cor);
        peca.title = `${jogador.nome} • ${TEMAS_BONECOS[index]}`;
        peca.innerHTML = `
            <div class="boneco-sombra"></div>
            <div class="boneco-corpo">
                <div class="boneco-cabeca">${ICONES_BONECOS[index]}</div>
                <div class="boneco-torso"></div>
                <div class="boneco-base"></div>
            </div>
            <span class="boneco-numero">${index + 1}</span>
        `;

        const totalNaCasa = jogadores.filter(j =>
            (j.posicaoVisual || j.posicao) === posicao
        ).length;

        const mesmaCasaAntes = jogadores.slice(0, index).filter(j =>
            (j.posicaoVisual || j.posicao) === posicao
        ).length;

        peca.style.setProperty("--offset", mesmaCasaAntes);
        peca.style.setProperty("--cor-jogador", jogador.cor);
        peca.dataset.total = totalNaCasa;

        casa.appendChild(peca);
    });
}

function atualizarPlacar() {
    placar.innerHTML = "";

    jogadores.forEach((jogador, index) => {
        const item = document.createElement("div");
        item.className = "placar-jogador";
        item.style.borderLeft = `5px solid ${jogador.cor}`;

        if (index === jogadorAtual && !partidaTerminou) {
            item.classList.add("jogador-ativo");
        }

        item.innerHTML = `
            <span>${index + 1}. ${jogador.nome}</span>
            <strong>Casa ${jogador.posicao} • ${jogador.pontos} pts ${jogador.escudo ? "• 🛡️" : ""}</strong>
        `;

        placar.appendChild(item);
    });
}

function finalizarPartida(vencedor) {
    partidaTerminou = true;
    btnDado.disabled = true;

    jogadorDaVez.textContent = `🏆 ${vencedor.nome} VENCEU!`;
    mensagemJogo.textContent =
        `Parabéns, ${vencedor.nome}! Você chegou primeiro à casa 120.`;

    atualizarPlacar();

    setTimeout(() => {
        const jogarNovamente = confirm(
            `🏆 ${vencedor.nome} venceu!\n\nDeseja começar uma nova partida?`
        );

        if (jogarNovamente) {
            mostrarTela(telaJogadores);
        }
    }, 300);
}

btnReiniciar.addEventListener("click", () => {
    const confirmar = confirm("Começar uma nova partida?");
    if (confirmar) {
        mostrarTela(telaJogadores);
    }
});

btnMenu.addEventListener("click", () => {
    const confirmar = confirm("Voltar ao menu? A partida atual será encerrada.");
    if (confirmar) {
        jogadores = [];
        jogadorAtual = 0;
        partidaTerminou = false;
        mostrarTela(telaInicial);
    }
});

// Permite apertar Enter no último campo para iniciar.
listaJogadores.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        iniciarPartida();
    }
});


function registrarAcao(jogador, texto) {
    historico.unshift({ nome: jogador.nome, cor: jogador.cor, texto });
    historico = historico.slice(0, 5);
    renderHistorico();
}

function renderHistorico() {
    if (!historicoAcoes) return;
    historicoAcoes.innerHTML = historico.length ? historico.map(a => `
        <div class="acao"><span class="ponto" style="background:${a.cor}"></span><strong>${a.nome}</strong> ${a.texto}.</div>
    `).join('') : '<div class="acao">Nenhuma jogada ainda.</div>';
}

// Abre o menu inicialmente.
mostrarTela(telaInicial);
