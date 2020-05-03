import React, { useCallback } from "react";
import { useGameSelector, useActionDispatch } from "../../../../redux";
import { getPlayer } from "../../../../redux/localStorage";
import { Reading } from "./Reading";
import { Flex } from "@rebass/grid/emotion";
import { theme } from "../../../../theme";
import { Box, Typography, Button } from "@material-ui/core";
import { selectActivePlayer, selectCards } from "@fishbowl/common";
import { TimerContextProvider, useTimerContext } from "./timer";
import { ActionButtons } from "./ActionButtons";
import { useRouteMatch } from "react-router-dom";
import { GameInviteButton } from "../../components/GameInviteButton";
import { GameHeader } from "./GameHeader";
import { GameStatus } from "./GameStatus";
import { GameTimer } from "./GameTimer";
import { CardArea } from "./CardArea";

export const Active: React.FC = () => {
  const { id } = getPlayer();
  const teams = useGameSelector((game) => game.teams);
  const activePlayer = useGameSelector((game) => game.activePlayer);
  const activeTurn = useGameSelector((game) => game.turns.active);

  const isReading =
    teams[activePlayer.team][activePlayer.index[activePlayer.team]] === id;
  const isGuessing = teams[activePlayer.team].includes(id);
  const isFresh = useGameSelector((game) => game.turns.active.isFresh);
  const recap = useGameSelector((game) => game.turns.recap);

  // If turn is fresh, Reading player should be able to skip or start their turn

  // I need a selector for brand new turn

  /*
  Layout
  Round #       GameCode
  Card Count    Score

  Your status
    isNewTurn? Up Next
      areYouActive ? You're up next!
    areYouActive ? Your turn
    isYourTeamActive ? You're guessing
    You're Spectating
  What are other people doing
    areYouActive ? Teammates names are guessing
    isYourTeamActive ? activePlayer is giving You & other teammates clues
    activePlayer is giving his teammates clues
  Timer
    isNewTurn ? Times up!
    areYouActive ?  Timer Button
    isPaused ? paused indicator
    Time Remaining
  Card Area
    isFresh ? Recap
      recap == null ? Welcome to game
    isPaused ? null
    isYourTurn ? active card
    null
  
  if you are active && is fresh
    skip turn / start turn
  else if you are active && is paused
    resume
  else if you are active
    Skip / Got Card

  */
  return (
    <TimerContextProvider>
      <Flex flex="1 0 auto" flexDirection="column" padding={theme.spacing(2)}>
        <Flex flex="1 0 auto" flexDirection="column">
          <GameHeader></GameHeader>
          <GameStatus></GameStatus>
          <GameTimer></GameTimer>
          <CardArea></CardArea>
        </Flex>
        <ActionButtons></ActionButtons>
      </Flex>
    </TimerContextProvider>
  );
};
