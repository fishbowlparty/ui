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
  ADVANCE_FROM_DRAFTING,
  ADVANCE_FROM_REGISTRATION,
  ADVANCE_FROM_WRITING,
  SET_GAME_SETTINGS,
  SET_TEAMS,
  SKIP_CARD,
  SKIP_TURN,
  START_TURN,
  SUBMIT_CARDS,
} from "./types";
import { selectCards, selectNumberOfPlayers } from "./selectors";

const initialGame: Game = {
  gameCode: "",
  phase: "registration",
  playerCards: {},
  activePlayer: {
    team: "orange",
    index: {
      orange: 0,
      blue: 0,
    },
  },
  hostId: "",
  players: {},
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

  const { [playerId]: _, ...players } = game.players;
  return {
    ...game,
    players,
  };
}

function joinGame(game: Game, action: JOIN_GAME): Game {
  if (game.phase !== "registration") {
    return game;
  }

  const { playerId, name } = action.payload;
  const joinOrder =
    game.players[playerId]?.joinOrder ??
    Math.max(...Object.values(game.players).map((player) => player.joinOrder)) +
      1;

  return {
    ...game,
    players: {
      ...game.players,
      [playerId]: {
        id: playerId,
        name,
        joinOrder,
      },
    },
  };
}

function advanceFromRegistration(
  game: Game,
  action: ADVANCE_FROM_REGISTRATION
): Game {
  const { teams, firstTeam } = action.payload;

  if (game.phase !== "registration") {
    return game;
  }
  // requires at least 4 players
  if (selectNumberOfPlayers(game) < 4) {
    return game;
  }
  return {
    ...game,
    teams,
    activePlayer: {
      team: firstTeam,
      index: { orange: 0, blue: 0 },
    },
    phase: "writing",
  };
}
function advanceFromWriting(game: Game, action: ADVANCE_FROM_WRITING): Game {
  if (game.phase !== "writing") {
    return game;
  }
  // requires at least 1 player's cards to be submitted
  if (Object.keys(game.playerCards).length < 1) {
    return game;
  }

  return {
    ...game,
    phase: "drafting",
  };
}
function advanceFromDrafting(game: Game, action: ADVANCE_FROM_DRAFTING): Game {
  if (game.phase !== "drafting") {
    return game;
  }
  // all players must be assigned to a team
  const { orange, blue } = game.teams;
  if (orange.length < 2 || blue.length < 2) {
    return game;
  }
  if (orange.length + blue.length !== selectNumberOfPlayers(game)) {
    return game;
  }

  // initialize turn order state
  return {
    ...game,
    phase: "active",
    round: {
      number: 1,
      guessedCardIds: [],
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

export function submitCards(game: Game, action: SUBMIT_CARDS): Game {
  if (game.phase !== "writing") {
    return game;
  }

  const { playerId, cards } = action.payload;

  return {
    ...game,
    playerCards: {
      ...game.playerCards,
      [playerId]: cards,
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
    Object.keys(selectCards(game)).length
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

export function GameReducer(game: Game = initialGame, action: Actions): Game {
  switch (action.type) {
    // phase
    case "ADVANCE_FROM_REGISTRATION":
      return advanceFromRegistration(game, action);
    case "ADVANCE_FROM_WRITING":
      return advanceFromWriting(game, action);
    case "ADVANCE_FROM_DRAFTING":
      return advanceFromDrafting(game, action);

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
