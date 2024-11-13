const WebSocket = require("ws");

function onError(ws, err) {
    console.error(`onError: ${err.message}`);
}

function onMessage(ws, data) {
    console.log(`Mensagem recebida: ${data}`);
    ws.send(`Mensagem recebida pelo servidor! Sua mensagem foi: ${data}`);
}

function broadcast(jsonObject) {
    if (!this.clients) return;
    this.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(jsonObject));
        }
    });
}

function onConnection(ws, req) {
    ws.on("message", (data) => onMessage(ws, data));
    ws.on("error", (error) => onError(ws, error));
    console.log(`Conexão realizada com o client!`);
}

module.exports = (server) => {
    const wss = new WebSocket.Server({
        server
    });

    wss.on("connection", onConnection);
    wss.broadcast = broadcast;

    console.log(`App Web Socket Server rodando!`);
    return wss;
};