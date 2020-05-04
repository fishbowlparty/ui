import { Button } from "@material-ui/core";
import React, { useCallback } from "react";
import { useActionDispatch, useGameSelector } from "../../../redux";
import {
  Game,
  GamePhase,
  selectHost,
  selectNumberOfPlayers,
} from "@fishbowl/common";
import { getPlayer } from "../../../redux/localStorage";

export const AdvancePhaseButton: React.FC = () => {
  const { id } = getPlayer();
  const phase = useGameSelector((game) => game.phase);
  const game = useGameSelector((game) => game);
  const host = useGameSelector(selectHost);
  const dispatch = useActionDispatch();

  const isHost = host?.id === id;
  const errorMessage = advanceErrorMessage(game, phase);
  const isDisabled = errorMessage != null || !isHost;
  const message =
    errorMessage ||
    (isHost ? hostMessage(phase) : `${host?.name} will start the game...`);

  const onClick = useCallback(() => {
    if (phase === "registration") {
      const firstTeam = Math.random() > 0.5 ? "orange" : "blue";
      const teams = Object.values(game.players).reduce(
        (teams, player, i) => {
          const team = i % 2 === 0 ? "orange" : "blue";
          teams[team].push(player.id);

          return teams;
        },
        {
          orange: [],
          blue: [],
        } as Game["teams"]
      );

      dispatch({
        type: "ADVANCE_FROM_REGISTRATION",
        payload: { teams, firstTeam },
      });
    }
    if (phase === "writing") {
      dispatch({
        type: "ADVANCE_FROM_WRITING",
        payload: {},
      });
    }
    if (phase === "drafting") {
      dispatch({
        type: "ADVANCE_FROM_DRAFTING",
        payload: {},
      });
    }
  }, [dispatch, phase, game]);

  return (
    <Button
      fullWidth
      variant="outlined"
      color="primary"
      disabled={isDisabled}
      onClick={onClick}
    >
      {message}
    </Button>
  );
};

export const advanceErrorMessage = (
  game: Game,
  phase: GamePhase
): string | null => {
  if (phase === "registration") {
    // requires at least 4 players
    if (selectNumberOfPlayers(game) < 4) {
      return "Waiting for 4 players...";
    }
    return null;
  }
  if (phase === "writing") {
    // TODO: how many cards are required to advance?
    if (Object.keys(game.playerCards).length < 1) {
      return "Waiting for cards...";
    }

    return null;
  }
  if (phase === "drafting") {
    // all players must be assigned to a team
    const { orange, blue } = game.teams;
    if (orange.length < 2 || blue.length < 2) {
      return "Teams must have 2 players";
    }

    // initialize turn order state
    return null;
  }

  return null;
};

const hostMessage = (phase: GamePhase) => {
  switch (phase) {
    case "registration":
      return "Everyone is here";
    case "writing":
      return "Choose Teams";
    case "drafting":
      return "Start Game";
  }
  return "";
};

const phaseOrder: GamePhase[] = [
  "registration",
  "writing",
  "drafting",
  "active",
];
const nextPhase = (phase: GamePhase) => {
  const i = phaseOrder.indexOf(phase);
  return phaseOrder[i + 1];
};
