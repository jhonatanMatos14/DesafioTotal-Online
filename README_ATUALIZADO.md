# Desafio Total Online — versão atualizada

Esta versão inclui o multiplayer com Node.js + Socket.IO, salas por código, sincronização de partida, reconexão real após quedas curtas de internet e matchmaking rápido.

## Rodar no PC

```bash
npm install
npm start
```

Abra: http://localhost:3000

## Publicar na internet

O projeto já inclui `render.yaml` para facilitar o deploy em um serviço Node compatível com WebSocket/Socket.IO.

- Build Command: `npm install`
- Start Command: `npm start`
- Porta: definida automaticamente por `process.env.PORT`

Depois do deploy, use a URL HTTPS pública fornecida pelo serviço e compartilhe com os jogadores.

## V111 — Reconexão real

- Queda curta de internet não encerra imediatamente a sala.
- O Socket.IO tenta recuperar a sessão por até 120 segundos.
- O jogador recuperado mantém a sala e o estado da partida.
- O host também pode reconectar dentro desse período.
- Se a conexão não voltar dentro do prazo, o jogador é removido e a sala é atualizada.

## V112 — Matchmaking rápido

- Botão **ENCONTRAR PARTIDA** na tela online.
- Jogadores entram em uma fila automática.
- Quando dois jogadores estão disponíveis, o servidor cria uma sala automaticamente.
- Os dois entram na mesma partida sem precisar compartilhar código.
- A partida começa automaticamente assim que o par é encontrado.
- É possível cancelar a busca antes de encontrar um adversário.
