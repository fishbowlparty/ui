import React, { useEffect, useState } from "react";
import { Provider as ReduxProvider, useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import io from "socket.io-client";
import { useGameSelector, useGameStore, useActionDispatch } from "../../redux";
import { Active } from "./phase/Active";
import { Canceled } from "./phase/Canceled";
import { Drafting } from "./phase/Drafting";
import { Ended } from "./phase/Ended";
import { Registration } from "./phase/Registration";
import { Writing } from "./phase/Writing";
import { getPlayer } from "../../redux/localStorage";

/*
Notes for socket server:
- Requests are pinned to servers by game id
- Game states & their sockets are held in memory on servers, keyed by id
  - When a server receives a request for a game, it checks if the game is already in memory
    - If not, the game state is read out of the database, a new redux store is init'd with the game state
      - If game is not in DB, 404 or equivalent down the socket. and reap?
    - For each new socket connection, send init event with current game state.
    - Subscribe to the store and push subsequent updates out onto the socket
    - Subscribe to the store and write back to the db. DB writes are only for backup in case of server crash / game recovery.
      - Need to check about how socket reconnects from client work on a server crash
    - Listen on the sockets for events, and dispatch them onto the store
    - Q: how are games reaped? Both in memory sessions, and db records. X time after ended? X time after last interaction? greater than 24 hr old?
*/

export const GameView: React.FC<RouteComponentProps<{
  gameCode: string;
}>> = (props) => {
  const [connected, setConnected] = useState(true);
  const { gameCode } = props.match.params;
  // const socket = useMemo(() => io(gameCode), [gameCode]);
  useEffect(() => {
    // TODO: namespace socket connection so that it can be sticky to server by gameCode
    const socket = io(gameCode);
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    // TODO: type this data
    // May need separate "first / init" event to initialize store from subsequent update events
    //@ts-ignore
    socket.on("data", (data) => {
      console.log(data);
    });

    // TODO: how do I clean up a socket?
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [gameCode]);

  const { id, name } = getPlayer();
  const store = useGameStore({
    gameCode,
    phase: "registration",
    cards: {},
    activePlayer: {
      team: "orange",
      index: {
        orange: 0,
        blue: 0,
      },
    },
    hostId: id,
    players: [
      {
        id,
        name,
      },
      {
        id: "1",
        name: "Caitlin",
      },
      {
        id: "2",
        name: "Dan",
      },
      {
        id: "3",
        name: "Chris",
      },
      {
        id: "4",
        name: "Sarah",
      },
    ],
    round: {
      guessedCardIds: [],
      number: 0,
    },
    score: {
      orange: 0,
      blue: 0,
    },
    settings: {
      cardsPerPlayer: 3,
      numberOfRounds: 3,
      skipPenalty: -1,
      turnDuration: 45,
    },
    teams: {
      orange: [],
      blue: [],
    },
    turns: {
      active: {
        paused: true,
        timeRemaining: 45,
        guessedCardIds: [],
        skippedCardIds: [],
      },
      previous: {
        paused: true,
        timeRemaining: 45,
        guessedCardIds: [],
        skippedCardIds: [],
      },
    },
  });

  if (!connected) {
    return <div>loading...</div>;
  }

  // deal with socket error / 404 here
  if (false) {
    return <div>404 or error?</div>;
  }

  return (
    <ReduxProvider store={store}>
      <PhaseSwitcher></PhaseSwitcher>
    </ReduxProvider>
  );
};

const PhaseSwitcher: React.FC = () => {
  const phase = useGameSelector((state) => state.phase);

  switch (phase) {
    case "registration":
      return <Registration></Registration>;
    case "writing":
      return <Writing></Writing>;
    case "drafting":
      return <Drafting></Drafting>;
    case "active":
      return <Active></Active>;
    case "canceled":
      return <Canceled></Canceled>;
    case "ended":
      return <Ended></Ended>;
  }
};
