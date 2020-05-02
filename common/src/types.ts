export type GamePhase =
  | "registration"
  | "writing"
  | "drafting"
  | "active"
  | "ended"
  | "canceled";

export interface GameSettings {
  numberOfRounds: number;
  cardsPerPlayer: number;
  turnDuration: number;
  skipPenalty: number; // 0 or -1
}

export interface Player {
  id: string;
  name: string;
  joinOrder: number;
}

export type TeamName = "orange" | "blue";

export interface Card {
  id: string;
  text: string;
}

export interface Turn {
  isFresh: boolean;
  paused: boolean;
  timeRemaining: number;
  activeCardId: string;
  guessedCardIds: Record<string, boolean>;
  skippedCardIds: Record<string, boolean>;
}

export interface TurnRecap {
  team: TeamName;
  guessedCardIds: string[];
  skippedCardCount: number;
}

export interface Game {
  // game is created with this state
  gameCode: string;
  phase: GamePhase;
  settings: GameSettings;
  hostId: string;

  // built up during registration:
  players: Record<string, Player>;
  // built during writing - record of player id to cards
  playerCards: Record<string, Card[]>;

  //built during drafting
  teams: Record<TeamName, string[]>;

  // game state
  score: Record<TeamName, number>;
  activePlayer: {
    team: TeamName;
    index: Record<TeamName, number>;
  };
  round: {
    number: number;
    guessedCardIds: Record<string, boolean>;
  };
  turns: {
    active: Turn;
    recap: TurnRecap | null;
  };
}

/**
 * ADMINISTRATIVE ACTIONS
 */
// auth rule: only host
// business rule: only allow valid transitions, do validation of game model (> 4 players, valid teams, whatever) before advancing
export interface SET_GAME_SETTINGS {
  type: "SET_GAME_SETTINGS";
  payload: {
    settings: GameSettings;
  };
}

export interface ADVANCE_FROM_REGISTRATION {
  type: "ADVANCE_FROM_REGISTRATION";
  payload: {
    teams: Record<TeamName, string[]>;
    firstTeam: TeamName;
  };
}

export interface ADVANCE_FROM_WRITING {
  type: "ADVANCE_FROM_WRITING";
  payload: {};
}

export interface ADVANCE_FROM_DRAFTING {
  type: "ADVANCE_FROM_DRAFTING";
  payload: {};
}

// auth rule: playerId must be self
export interface JOIN_GAME {
  type: "JOIN_GAME";
  payload: {
    playerId: string;
    name: string;
  };
}

// auth rule: playerId must be self or host
export interface LEAVE_GAME {
  type: "LEAVE_GAME";
  payload: {
    playerId: string;
  };
}

// auth rule: playerId must be self
// business rule: cards required, valid, number is equal to game setting?
export interface SUBMIT_CARDS {
  type: "SUBMIT_CARDS";
  payload: {
    playerId: string;
    cards: Card[];
  };
}

// auth rule: only host
// business rule: all players accounted for, each team >= 2 players
// Note: maybe these validation rules should happen at state transitions,
//   not at the time the event comes in - allow for real-time updating as host arranges teams
export interface SET_TEAMS {
  type: "SET_TEAMS";
  payload: {
    teams: Record<TeamName, string[]>;
  };
}

export type ADMIN_ACTIONS =
  | ADVANCE_FROM_REGISTRATION
  | ADVANCE_FROM_WRITING
  | ADVANCE_FROM_DRAFTING
  | SET_GAME_SETTINGS
  | JOIN_GAME
  | LEAVE_GAME
  | SUBMIT_CARDS
  | SET_TEAMS;

/**
 * GAMEPLAY ACTIONS
 *
 * skip turn
 *  advances turn within the same team
 *  only possible if a turn has not yet been started
 * start turn
 *  unpauses turn, starts timer
 * pause turn
 *  pauses turn, stops timers
 * end turn
 *  Advances turn to next team & player
 *
 * GOT IT
 * skip
 */
export interface SKIP_TURN {
  type: "SKIP_TURN";
  payload: {};
}

export interface START_TURN {
  type: "START_TURN";
  payload: {
    drawSeed: number;
  };
}

export interface PAUSE_TURN {
  type: "PAUSE_TURN";
  payload: { timeRemaining: number };
}

export interface END_TURN {
  type: "END_TURN";
  payload: {};
}

export interface GOT_CARD {
  type: "GOT_CARD";
  payload: {
    timeRemaining: number;
    cardId: string;
    drawSeed: number;
  };
}

export interface SKIP_CARD {
  type: "SKIP_CARD";
  payload: {
    cardId: string;
    drawSeed: number;
  };
}

export type GAMEPLAY_ACTIONS =
  | SKIP_TURN
  | START_TURN
  | PAUSE_TURN
  | END_TURN
  | GOT_CARD
  | SKIP_CARD;

export type Actions = ADMIN_ACTIONS | GAMEPLAY_ACTIONS;

export interface SERVER_INIT_STATE {
  type: 'SERVER_INIT_STATE',
  payload: Game
}

export interface SERVER_UPDATE_STATE {
  type: 'SERVER_UPDATE_STATE',
  payload: Game
}

export interface SERVER_NOT_FOUND {
  type: 'SERVER_NOT_FOUND',
  payload: {}
}

export type ServerEvents = SERVER_INIT_STATE | SERVER_UPDATE_STATE | SERVER_NOT_FOUND
/*
Optimizations
Make players an object for easier lookups?
Skip deck can be map, ordering does not matter, cheaper lookups
*/

// helper functions take game state, return new game state
/*
What are the "side effect things that happen?"
- Initialize a round
  - Set number
  - Shuffle deck
  - Reset guessed
- Initialize a turn
  - Move current turn to recap (set time remaining)
  
  - Current Turn
    - Set playerId
    - Set time remaining
    - Paused is  true
    - Reset skipped / guessed
  - More?
  - Move guessed deck from turn into round
  - Shuffle skipped deck back into draw deck
  - Update game score 
- Update turn ordering
  - Given a team, return up next playerId and updated turn ordering state

- Got Card
  - Removes gotten card from draw deck & skip deck, puts card into guessed deck (of turn)
  - If draw & skip decks are empty...
    - Re-initialize turn with same player and current time remaining
    - Re-initialize the round with round number + 1
    - If round is > max...
      - End game

- Skip card
  - Remove card from draw deck, add it to skipped deck


- End turn
  - Update turn ordering (inactive team)
  - Initialize turn with new player id
*/

