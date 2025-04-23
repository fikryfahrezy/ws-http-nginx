import cors from "cors";
import express from "express";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Server } from "socket.io";
import { WebSocketServer } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.static("dist"));

const server = createServer(app);

const io = new Server(server, {
  path: "/io/",
  cors: {
    allowedHeaders: "*",
    origin: "*",
  },
});
const wss = new WebSocketServer({ noServer: true });

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

app.get("/hello", (req, res) => {
  res.json({ hello: "world" });
});

app.get("/auth", (req, res) => {
  res.json({ token: "Bearer foo" });
});

io.on("connection", (socket) => {
  io.emit("connected", "hello world!");
});

wss.on("connection", function connection(ws) {
  ws.on("message", function message(data, isBinary) {
    ws.send("connected");
  });
});

server.on("upgrade", (req, socket, head) => {
  if (req.url === "/ws") {
    wss.handleUpgrade(req, socket, head, function done(ws) {
      wss.emit("connection", ws, req);
    });
  } else {
    socket.destroy();
  }
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
