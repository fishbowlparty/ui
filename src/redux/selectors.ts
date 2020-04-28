import { Game, GamePhase } from "./types";

export const selectCanAdvanceToPhase = (
  game: Game,
  phase: GamePhase
): boolean => {
  if (phase === "registration") {
    return false;
  }
  if (phase === "writing") {
    if (game.phase !== "registration") {
      return false;
    }
    // requires at least 4 players
    if (game.players.length < 4) {
      return false;
    }
    return true;
  }
  if (phase === "drafting") {
    if (game.phase !== "writing") {
      return false;
    }
    // requires at least 1 card
    if (Object.keys(game.cards).length < 1) {
      return false;
    }

    return true;
  }
  if (phase === "active") {
    if (game.phase !== "drafting") {
      return false;
    }
    // all players must be assigned to a team
    const { orange, blue } = game.teams;
    if (orange.length < 2 || blue.length < 2) {
      return false;
    }
    if (orange.length + blue.length !== game.players.length) {
      return false;
    }

    // initialize turn order state
    return true;
  }

  // you can cancel a game at any point
  if (phase === "canceled") {
    return true;
  }
};
