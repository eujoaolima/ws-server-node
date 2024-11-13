const { token } = require("morgan");
const WebSocket = require("ws");


function onError(ws, err) {
    console.error(`onError: ${err.message}`);
}

function onMessage(ws, data) {
    console.log(`Mensagem recebida: ${data}`);
    ws.send(`Mensagem recebida pelo servidor! Sua mensagem foi: ${data}`);
}

function broadcast(jsonObject) {
    if (!this.clients) 
        return;

    this.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN)
            client.send(JSON.stringify(jsonObject));
    });
}

function onConnection(ws, req) {
    ws.on("message", (data) => onMessage(ws, data));
    ws.on("error", (error) => onError(ws, error));
    console.log(`Conexão realizada com o client!`);
}

function corsValidation(origin) {
    return process.env.CORS_ORIGIN === 'http://localhost:3000' || process.env.CORS_ORIGIN.startsWith(origin);
}

function verifyClient(info, callback) {
    if (!corsValidation(info.origin))
        return callback(false);

    const token = info.req.url.split('token=')[1];

    if (token)
        if (token === '123456')
            return callback(true);

    return callback(false);
}

module.exports = (server) => {
    const wss = new WebSocket.Server({
        server,
        verifyClient
    });

    wss.on("connection", onConnection);
    wss.broadcast = broadcast;

    console.log(`App Web Socket Server rodando!`);
    return wss;
};
