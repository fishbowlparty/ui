import { Actions } from "@fishbowl/common";
import { ServerEvents } from "@fishbowl/common";
import express from "express";
import socketIo from "socket.io";
import { createServer } from "http";
import { migrate } from "./postgres";
import { getGameStore, createGame } from "./games";
import bodyParser from "body-parser";
import { CONFIG } from "./config";
import { Unsubscribe } from "redux";
import { clearTimeout } from "timers";

function send(socket: socketIo.Socket, message: ServerEvents) {
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
  //these directory paths are kind of dub because of how the dockerfile copies files around
  //should really be cleaned up
  app.use(express.static("public"));
  app.get("*", function (request, response) {
    response.sendFile("/app/public/index.html");
  });

  io.on("connection", async (socket) => {
    const { gameCode, playerId } = socket.handshake.query;
    const gameStore = await getGameStore(gameCode);

    if (gameStore == null) {
      send(socket, {
        type: "SERVER_NOT_FOUND",
        payload: {},
      });
      return socket.disconnect();
    }

    send(socket, {
      type: "SERVER_INIT_STATE",
      payload: gameStore.getState(),
    });

    let unsubscribeFromStore: Unsubscribe | null = null;
    const onConnect = () => {
      unsubscribeFromStore && unsubscribeFromStore();
      unsubscribeFromStore = gameStore.subscribe(() => {
        send(socket, {
          type: "SERVER_UPDATE_STATE",
          payload: gameStore.getState(),
        });
      });
    };

    const onDisconnect = () => {
      unsubscribeFromStore && unsubscribeFromStore();
      gameStore.dispatch({ type: "LEAVE_GAME", payload: { playerId } });
    };

    let timeout: NodeJS.Timer;
    const startTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(onDisconnect, 10 * 1000);
    };

    if (socket.connected) {
      onConnect();
    }
    socket.on("connect", () => {
      onConnect();
    });

    socket.on("disconnect", () => {
      startTimeout();
    });

    socket.on("message", (action: Actions) => {
      console.log("<- action", JSON.stringify(action, null, 2));
      gameStore.dispatch(action);
    });
  });

  server.listen(CONFIG.PORT, () => {
    console.log("app listening on", CONFIG.PORT);
  });
})();
