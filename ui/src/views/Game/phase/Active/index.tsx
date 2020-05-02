import React from "react";
import { useGameSelector } from "../../../../redux";
import { getPlayer } from "../../../../redux/localStorage";
import { Reading } from "./Reading";

export const Active: React.FC = () => {
  const { id } = getPlayer();
  const teams = useGameSelector((game) => game.teams);
  const activePlayer = useGameSelector((game) => game.activePlayer);
  const activeTurn = useGameSelector((game) => game.turns.active);

  const isReading =
    teams[activePlayer.team][activePlayer.index[activePlayer.team]] === id;
  const isGuessing = teams[activePlayer.team].includes(id);
  const isTurnFresh = useGameSelector(
    (game) =>
      game.turns.active.paused &&
      game.turns.active.timeRemaining === game.settings.turnDuration
  );

  // If turn is fresh, Reading player should be able to skip or start their turn

  return <Reading></Reading>;
};
