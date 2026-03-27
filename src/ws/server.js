import { WebSocket, WebSocketServer } from "ws";

function sendJson(socket, payload) {
    if (socket.readyState !== WebSocket.OPEN) {
        return;
    }
    socket.send(JSON.stringify(payload));
}

function broadcast(wss, payload) {
    for (const client of wss.clients) {
        if (client.readyState !== WebSocket.OPEN) {
            continue;
        }
        sendJson(client, payload);
    }
}

export function attachWebSocketServer(server) {
    const wss = new WebSocketServer({ server, path: "/ws", maxPayload: 1024 * 1024 })

    function heartbeat() {
        this.isAlive = true;
    }

    wss.on("connection", (socket) => {
        socket.isAlive = true;
        socket.on("pong", heartbeat);

        sendJson(socket, { type: "welcome", data: "Connected to the server" });

        socket.on("close", () => {
            console.log("Client disconnected");
        });

        socket.on("error", (error) => {
            console.error("Socket error:", error);
        });
    });

    const interval = setInterval(() => {
        wss.clients.forEach((socket) => {
            if (socket.isAlive === false) {
                return socket.terminate();
            }

            socket.isAlive = false;
            socket.ping();
        });
    }, 30000);

    wss.on("close", () => {
        clearInterval(interval);
    });

    function broadCastMatchCreate(match) {
        broadcast(wss, {
            type: "match_created",
            data: match,
        });
    }

    function broadCastMatchUpdated(match) {
        broadcast(wss, {
            type: "match_updated",
            data: match,
        });
    }

    return { broadCastMatchCreate, broadCastMatchUpdated };
}
