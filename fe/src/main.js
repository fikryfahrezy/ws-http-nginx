import { io } from "socket.io-client";
import { setupCounter } from "./counter.js";
import javascriptLogo from "./javascript.svg";
import "./style.css";
import viteLogo from "/vite.svg";

document.querySelector("#app").innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`;

setupCounter(document.querySelector("#counter"));

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const socket = io(BACKEND_URL, {
  path: "/io/",
});

socket.on("connected", (msg) => {
  console.log("message from socket io", msg);
});

const ws = new WebSocket("ws://localhost:3000/ws");

// Connection opened
ws.addEventListener("open", (event) => {
  console.log("connected");
  ws.send("Hello WSS Server!");
});

// Listen for messages
ws.addEventListener("message", (event) => {
  console.log("Message from WSS server ", event.data);
});

fetch((BACKEND_URL || "") + "/auth")
  .then((res) => {
    return res.json();
  })
  .then((json) => {
    console.log("json", json);
  });
