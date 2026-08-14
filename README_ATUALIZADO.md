# Desafio Total Online — versão atualizada

Esta versão inclui o multiplayer com Node.js + Socket.IO e o carregamento corrigido do `online.js`.

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
