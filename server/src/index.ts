import { Actions } from "@fishbowl/common";
import { ServerEvents } from "@fishbowl/common";
import express from "express";
import socketIo from "socket.io";
import { createServer } from "http";
import { migrate } from "./postgres";
import { getGameStore, createGame } from "./games";
import bodyParser from "body-parser";

console.log("hey there");

function send(socket: socketIo.Socket, message: ServerEvents) {
  console.log("sending", message);
  socket.send(message);
}

(async function () {
  await migrate();

  const app = express();
  app.use(bodyParser.json());
  app.post("/create", async (req, res) => {
    const { hostId } = req.body;
    if (hostId == null) {
      return res.status(404).json({ message: "hostId is required" });
    }
    const { gameCode } = await createGame(hostId);
    return res.json({ gameCode });
  });

  const server = createServer(app);

  const io = socketIo(server);
  io.on("connection", async (socket) => {
    const { gameCode } = socket.handshake.query;
    console.log("connection", gameCode);

    const gameStore = await getGameStore(gameCode);
    if (gameStore == null) {
      send(socket, {
        type: "SERVER_NOT_FOUND",
        payload: {},
      });
      socket.disconnect();
    }

    send(socket, {
      type: "SERVER_INIT_STATE",
      payload: gameStore.getState(),
    });

    gameStore.subscribe(() => {
      send(socket, {
        type: "SERVER_UPDATE_STATE",
        payload: gameStore.getState(),
      });
    });

    socket.on("message", (action: Actions) => {
      console.log("socket message", action);
      gameStore.dispatch(action);
    });
  });

  server.listen(3001, () => {
    console.log("app listening");
  });
})();
