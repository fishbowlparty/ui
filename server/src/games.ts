import { createStore, Store } from "redux";
import * as db from "./postgres";
import { GameReducer, Game, Actions } from "@fishbowl/common";

// export const getGame = (gameCode: string): Promise<Store> => {};
const initialGame: Game = {
  gameCode: "_PLACEHOLDER",
  phase: "registration",
  activePlayer: {
    team: "orange",
    index: {
      orange: 0,
      blue: 0,
    },
  },
  hostId: "_PLACEHOLDER",
  players: {},
  playerCards: {},
  round: {
    guessedCardIds: {},
    number: 1,
  },
  score: {
    orange: 0,
    blue: 0,
  },
  settings: {
    cardsPerPlayer: 3,
    numberOfRounds: 3,
    skipPenalty: -1,
    turnDuration: 60,
  },
  teams: {
    orange: [],
    blue: [],
  },
  turns: {
    active: {
      isFresh: true,
      paused: true,
      activeCardId: "",
      timeRemaining: 60,
      guessedCardIds: {},
      skippedCardIds: {},
    },
    recap: null,
  },
};

export async function createGame(hostId: string) {
  let gameCode = generateGameCode();
  while ((await db.getGame(gameCode)) != null) {
    gameCode = generateGameCode();
  }

  await db.upsertGame({ ...initialGame, gameCode, hostId });

  return {
    gameCode,
  };
}

const games: Record<string, Promise<null | Store<Game, Actions>>> = {};

export async function getGameStore(gameCode: string) {
  if (games[gameCode] == null) {
    games[gameCode] = createGameStore(gameCode);
  }
  return games[gameCode];
}

async function createGameStore(gameCode: string) {
  const game = await db.getGame(gameCode);

  if (game == null) {
    return null;
  }

  const store = createStore(GameReducer, game);

  // TODO: need a reaping strategy
  const unsubscribe = store.subscribe(() => {
    db.upsertGame(store.getState());
  });

  return store;
}

export interface Options {
  length?: number;
}
export function generateGameCode({ length = 4 }: Options = {}) {
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var charactersLength = characters.length;

  let gameCode = "";
  for (var i = 0; i < length; i++) {
    gameCode += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return gameCode;
}
