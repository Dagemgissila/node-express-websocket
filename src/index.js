import express from "express";
import { matchRouter } from "./routes/matches.js";
import http from "http";
import { attachWebSocketServer } from "./ws/server.js";

const app = express();
const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST


// JSON middleware
app.use(express.json());
const server = http.createServer(app)
// Root route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.use("/matches", matchRouter);

const { broadCastMatchCreate } = attachWebSocketServer(server);
app.locals.broadCastMatchCreate = broadCastMatchCreate;

server.listen(PORT, HOST, () => {
  const baseUrl = HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
  console.log(`Server is running at ${baseUrl}`);
  console.log(`WebSocket server running at ${baseUrl.replace('http', 'ws')}/ws`)
});