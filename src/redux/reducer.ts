import {
  nextPlayerNextTeam,
  nextPlayerSameTeam,
  nextRound,
  nextTurn,
} from "./mutations";
import {
  Actions,
  END_TURN,
  Game,
  GOT_CARD,
  JOIN_GAME,
  LEAVE_GAME,
  PAUSE_TURN,
  SET_GAME_PHASE,
  SET_GAME_SETTINGS,
  SET_TEAMS,
  SKIP_CARD,
  SKIP_TURN,
  START_TURN,
  SUBMIT_CARDS,
} from "./types";

// where is randomness?
// randomize teams
// randomize which team goes first
// so - dont optimiztic update phase changes, dont do a draw deck and instead let the active client draw cards

// NO INSTEAD, PUSH RANDOMNESS INTO ACTION PAYLOADS

const initialGame: Game = {
  gameCode: "",
  phase: "registration",
  cards: {},
  activePlayer: {
    team: "orange",
    index: {
      orange: 0,
      blue: 0,
    },
  },
  hostId: "",
  players: [],
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
};

function leaveGame(game: Game, action: LEAVE_GAME): Game {
  if (game.phase !== "registration") {
    return game;
  }
  const { playerId } = action.payload;
  return {
    ...game,
    players: game.players.filter((player) => player.id !== playerId),
  };
}

function joinGame(game: Game, action: JOIN_GAME): Game {
  if (game.phase !== "registration") {
    return game;
  }

  const { playerId, name } = action.payload;

  const playerIndex = game.players.findIndex(
    (player) => player.id === playerId
  );
  if (playerIndex < 0) {
    return {
      ...game,
      players: game.players.concat({ id: playerId, name }),
    };
  }
  return {
    ...game,
    players: [
      ...game.players.slice(0, playerIndex),
      { id: playerId, name },
      ...game.players.slice(playerIndex + 1),
    ],
  };
}

function shuffle(array: any[]) {
  array = array.slice();
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function setGamePhase(game: Game, action: SET_GAME_PHASE): Game {
  const { phase } = action.payload;

  if (phase === "registration") {
    return game;
  }
  if (phase === "writing") {
    if (game.phase !== "registration") {
      return game;
    }
    // requires at least 4 players
    if (game.players.length < 4) {
      return game;
    }
    return {
      ...game,
      phase,
    };
  }
  if (phase === "drafting") {
    if (game.phase !== "writing") {
      return game;
    }
    // requires at least 1 card
    if (Object.keys(game.cards).length < 1) {
      return game;
    }

    const playerIds = shuffle(game.players.map((player) => player.id));
    const breakPoint = Math.ceil(playerIds.length / 2);

    return {
      ...game,
      phase,
      teams: {
        orange: [...playerIds.slice(0, breakPoint)],
        blue: [...playerIds.slice(breakPoint)],
      },
    };
  }
  if (phase === "active") {
    if (game.phase !== "drafting") {
      return game;
    }
    // all players must be assigned to a team
    const { orange, blue } = game.teams;
    if (orange.length < 2 || blue.length < 2) {
      return game;
    }
    if (orange.length + blue.length !== game.players.length) {
      return game;
    }

    // initialize turn order state
    return {
      ...game,
      round: {
        number: 1,
        guessedCardIds: [],
      },
      activePlayer: {
        team: Math.random() > 0.5 ? "orange" : "blue",
        index: {
          orange: 0,
          blue: 0,
        },
      },
      turns: {
        active: {
          paused: true,
          timeRemaining: game.settings.turnDuration,
          guessedCardIds: [],
          skippedCardIds: [],
        },
        previous: {
          paused: true,
          timeRemaining: 0,
          guessedCardIds: [],
          skippedCardIds: [],
        },
      },
    };
  }

  // you can cancel a game at any point
  if (phase === "canceled") {
    return {
      ...game,
      phase,
    };
  }

  // Game can only end as a side effect of a round ending
  return game;
}

export function submitCards(game: Game, action: SUBMIT_CARDS): Game {
  if (game.phase !== "writing") {
    return game;
  }

  const { cards } = action.payload;

  return {
    ...game,
    cards: {
      ...game.cards,
      ...cards,
    },
  };
}

export function setTeams(game: Game, action: SET_TEAMS): Game {
  if (game.phase !== "drafting") {
    return game;
  }

  const { teams } = action.payload;

  return {
    ...game,
    teams,
  };
}

export function skipTurn(game: Game, action: SKIP_TURN): Game {
  if (game.phase !== "active") {
    return game;
  }

  const { active } = game.turns;

  if (!(active.paused && active.timeRemaining === game.settings.turnDuration)) {
    return game;
  }

  return nextPlayerSameTeam(game);
}

export function startTurn(game: Game, action: START_TURN): Game {
  if (game.phase !== "active") {
    return game;
  }

  return {
    ...game,
    round: {
      ...game.round,
    },
    turns: {
      ...game.turns,
      active: {
        ...game.turns.active,
        paused: false,
      },
    },
  };
}

export function pauseTurn(game: Game, action: PAUSE_TURN): Game {
  if (game.phase !== "active") {
    return game;
  }

  const { timeRemaining } = action.payload;

  return {
    ...game,
    round: {
      ...game.round,
    },
    turns: {
      ...game.turns,
      active: {
        ...game.turns.active,
        paused: true,
        timeRemaining,
      },
    },
  };
}

function gotCard(game: Game, action: GOT_CARD): Game {
  if (game.phase !== "active") {
    return game;
  }

  const { cardId, timeRemaining } = action.payload;

  const guessedCardIds = game.turns.active.guessedCardIds.includes(cardId)
    ? game.turns.active.guessedCardIds
    : [...game.turns.active.guessedCardIds, cardId];

  game = {
    ...game,
    turns: {
      ...game.turns,
      active: {
        ...game.turns.active,
        guessedCardIds,
      },
    },
  };

  // if we have now guessed all cards, go to the next round
  if (
    guessedCardIds.length + game.round.guessedCardIds.length >=
    Object.keys(game.cards).length
  ) {
    game = nextRound(game, timeRemaining);
  }

  return game;
}

function skipCard(game: Game, action: SKIP_CARD): Game {
  if (game.phase !== "active") {
    return game;
  }

  const { cardId } = action.payload;

  // TODO: making new references even when there are not changes
  const skippedCardIds = game.turns.active.skippedCardIds.includes(cardId)
    ? game.turns.active.skippedCardIds
    : [...game.turns.active.skippedCardIds, cardId];

  return {
    ...game,
    turns: {
      ...game.turns,
      active: {
        ...game.turns.active,
        skippedCardIds,
      },
    },
  };
}

function endTurn(game: Game, action: END_TURN): Game {
  return nextPlayerNextTeam(nextTurn(game));
}

function setSettings(game: Game, action: SET_GAME_SETTINGS): Game {
  return {
    ...game,
    settings: action.payload.settings,
  };
}

function assertUnreachable(x: never): never {
  throw new Error(`Unexpected Action ${JSON.stringify(x)}`);
}

export function GameReducer(game: Game = initialGame, action: Actions): Game {
  switch (action.type) {
    // phase
    case "SET_GAME_PHASE":
      return setGamePhase(game, action);

    // admin
    case "SET_GAME_SETTINGS":
      return setSettings(game, action);
    case "JOIN_GAME":
      return joinGame(game, action);
    case "LEAVE_GAME":
      return leaveGame(game, action);
    case "SUBMIT_CARDS":
      return submitCards(game, action);
    case "SET_TEAMS":
      return setTeams(game, action);

    // gameplay actions
    case "SKIP_TURN":
      return skipTurn(game, action);
    case "START_TURN":
      return startTurn(game, action);
    case "PAUSE_TURN":
      return pauseTurn(game, action);
    case "END_TURN":
      return endTurn(game, action);
    case "GOT_CARD":
      return gotCard(game, action);
    case "SKIP_CARD":
      return skipCard(game, action);

    // default
    default:
      return game;
  }
}

// think of secondary effects
//
