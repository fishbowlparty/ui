import { Game } from "./types";

// Updates activePlayer pointer to the next player on the next team
export function nextPlayerNextTeam(game: Game): Game {
  const { team } = game.activePlayer;
  const nextTeam = team === "blue" ? "orange" : "blue";

  return nextPlayerSameTeam({
    ...game,
    activePlayer: {
      ...game.activePlayer,
      team: nextTeam,
    },
  });
}

// Updates activePlayer pointer to the next player on the same team
export function nextPlayerSameTeam(game: Game): Game {
  const { team, index } = game.activePlayer;
  const nextIndex =
    index[team] >= game.teams[team].length - 1 ? 0 : index[team] + 1;

  return {
    ...game,
    activePlayer: {
      team,
      index: {
        ...index,
        [team]: nextIndex,
      },
    },
  };
}

// when entering active state
// when skipping a turn (next player same team, reset time)
// when end a turn (next player next team, reset time)
// when "GOT IT" down to zero (same player, time provided)
export function nextTurn(game: Game, timeRemaining?: number): Game {
  const { team } = game.activePlayer;

  const guessedCardIds = game.round.guessedCardIds.concat(
    game.turns.active.guessedCardIds
  );

  return {
    ...game,
    round: {
      ...game.round,
      guessedCardIds,
    },
    score: {
      ...game.score,
      [team]:
        game.score[team] +
        game.turns.active.guessedCardIds.length -
        game.turns.active.skippedCardIds.length * game.settings.skipPenalty,
    },
    turns: {
      active: {
        paused: true,
        timeRemaining: timeRemaining ?? game.settings.turnDuration,
        guessedCardIds: [],
        skippedCardIds: [],
      },
      previous: {
        ...game.turns.active,
        timeRemaining: timeRemaining ?? 0,
      },
    },
  };
}

export function nextRound(game: Game, timeRemaining: number): Game {
  const nextRoundNumber = game.round.number + 1;
  const nextPhase =
    nextRoundNumber > game.settings.numberOfRounds ? game.phase : "ended";

  return {
    ...nextTurn(game, timeRemaining),
    round: {
      number: nextRoundNumber,
      guessedCardIds: [],
    },
    phase: nextPhase,
  };
}
