import cors from "cors";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { WebSocketServer } from "ws";

const app = express();
app.use(cors());

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
