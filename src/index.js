import express from "express";
import { matchRouter } from "./routes/matches.js";
import http from "http";

const app = express();
const PORT = 8000;
const HOST = "0.0.0.0"


// JSON middleware
app.use(express.json());
const server = http.createServer(app)
// Root route
app.get('/', (req, res) => {
  res.send('Server is running.....!');
});

app.use("/matches", matchRouter);


server.listen(PORT, HOST, () => {
  const baseUrl =HOST=== "0.0.0.0" ?  `http://${HOST}:${PORT}` : `http://localhost:${PORT}`;
  console.log(`Server is running at   ${baseUrl}`);
});