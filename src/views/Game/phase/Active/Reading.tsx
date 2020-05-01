import styled from "@emotion/styled";
import {
  Button,
  IconButton,
  List,
  Typography,
  Box,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Card,
} from "@material-ui/core";
import { Remove, Check, Edit, Close } from "@material-ui/icons";
import { Flex } from "@rebass/grid/emotion";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { Link, useHistory, useRouteMatch, Redirect } from "react-router-dom";
import { useActionDispatch, useGameSelector } from "../../../../redux";
import { getPlayer, setPlayerName } from "../../../../redux/localStorage";
import { theme } from "../../../../theme";
import { useDispatch } from "react-redux";
import { AdvancePhaseButton } from "../../components/AdvancePhaseButton";
import { selectOrderedPlayers, selectCards } from "../../../../redux/selectors";

export const Reading: React.FC = () => {
  const { id } = getPlayer();
  const dispatch = useActionDispatch();

  const roundNumber = useGameSelector((game) => game.round.number);
  const nCards = useGameSelector(
    (game) => Object.values(game.playerCards).flat().length
  );
  const nCardsGuessed = useGameSelector(
    (game) => Object.keys(game.round.guessedCardIds).length
  );

  // want to remove guessed cards from skipped cards
  const nCardsSkipped = useGameSelector(
    (game) =>
      Object.keys(game.turns.active.skippedCardIds).filter(
        (cardId) => !game.round.guessedCardIds[cardId]
      ).length
  );
  const nCardsRemaining = nCards - nCardsGuessed - nCardsSkipped;
  const score = useGameSelector((game) => game.score);
  const namesAre = useGameSelector((game) => {
    const teamNames = game.teams[game.activePlayer.team]
      .filter((playerId) => playerId != id)
      .map((playerId) => game.players[playerId].name);

    return teamNames.reduce((s, name, i) => {
      let joiner = "";
      //if this is the last name in the list there is no joiner
      if (i === teamNames.length - 1) {
        if (teamNames.length === 1) {
          joiner = " is";
        } else {
          joiner = " are";
        }

        // if this is second to last, we want an "and"
      } else if (i === teamNames.length - 2) {
        // oxford comma if we have 3+
        if (teamNames.length > 2) {
          joiner = ", and ";
          // otherwise no commas
        } else {
          joiner = " and ";
        }
        // just a comma
      } else {
        joiner = ", ";
      }
      return `${s}${name}${joiner}`;
    }, "");
  });
  const paused = useGameSelector((game) => game.turns.active.paused);
  const isFresh = useGameSelector((game) => game.turns.active.isFresh);
  // active card logic:
  // if there are draw cards, random draw card
  // otherwise, rotate skipp deck
  // otherwuse null
  const activeCard = useGameSelector(
    (game) => selectCards(game)[game.turns.active.activeCardId]
  );

  const skipCard = useCallback(() => {
    if (activeCard == null) {
      return;
    }
    dispatch({
      type: "SKIP_CARD",
      payload: { cardId: activeCard.id, drawSeed: Math.random() },
    });
  }, [dispatch, activeCard]);

  const [timer, onTimerToggle] = useCountdownTimer();
  const gotCard = useCallback(() => {
    if (activeCard == null) {
      return;
    }
    dispatch({
      type: "GOT_CARD",
      payload: {
        cardId: activeCard.id,
        // TODO: need to wire this up?
        timeRemaining: timer,
        drawSeed: Math.random(),
      },
    });
  }, [dispatch, activeCard, timer]);

  const skipTurn = useCallback(() => {
    dispatch({ type: "SKIP_TURN", payload: {} });
  }, [dispatch]);
  const startTurn = useCallback(() => {
    dispatch({ type: "START_TURN", payload: { drawSeed: Math.random() } });
  }, [dispatch]);

  return (
    <Flex flexDirection="column" flex="1 0 auto" padding={theme.spacing(2)}>
      <Flex flex="1 0 auto" flexDirection="column">
        <Box m={1}>
          <Typography variant="h4" align="center">
            Round {roundNumber}
          </Typography>
        </Box>
        <Flex margin={`${theme.spacing(1)}px`}>
          <Flex flex="1 1 0%" alignItems="center" flexDirection="column">
            <Typography
              style={{ fontWeight: 300, lineHeight: "36px" }}
              color="textSecondary"
              variant="body1"
            >
              Cards Left
            </Typography>
            <Flex width="100%">
              <Flex
                flex="1 0 auto"
                justifyContent="flex-end"
                marginRight={`${theme.spacing(1)}px`}
              >
                <Typography variant="h6">{nCardsRemaining}</Typography>
              </Flex>
              <Typography variant="h6">/</Typography>
              <Flex flex="1 0 auto" marginLeft={`${theme.spacing(1)}px`}>
                <Typography variant="h6">{nCards}</Typography>
              </Flex>
            </Flex>
            <Typography variant="caption" color="textSecondary">
              &nbsp;{nCardsSkipped > 0 && `${nCardsSkipped} skipped`}&nbsp;
            </Typography>
          </Flex>
          <Flex flex="1 1 0%" alignItems="center" flexDirection="column">
            <Typography
              style={{ fontWeight: 300, lineHeight: "36px" }}
              color="textSecondary"
              variant="body1"
            >
              Score
            </Typography>
            <Flex width="100%">
              <Flex
                flex="1 0 auto"
                justifyContent="flex-end"
                marginRight={`${theme.spacing(1)}px`}
              >
                <Typography variant="h6" color="secondary">
                  {score.orange}
                </Typography>
              </Flex>
              <Flex flex="1 0 auto" marginLeft={`${theme.spacing(1)}px`}>
                <Typography variant="h6" color="primary">
                  {score.blue}
                </Typography>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Box m={1}>
          <Typography align="center">{namesAre} guessing for you.</Typography>
        </Box>
        <Box mb={1}>
          <Button
            variant="outlined"
            fullWidth
            onClick={onTimerToggle}
            // color="secondary"
          >
            <Flex flexDirection="column" alignItems="center">
              <Typography
                variant="caption"
                align="center"
                color="textSecondary"
              >
                Time Remaining
              </Typography>
              <Typography
                variant="h2"
                style={{ fontWeight: "bold" }}
                color="textSecondary"
              >
                {timer}
              </Typography>
              {/* <Typography variant="caption" align="center" color="textSecondary">
          {paused ? "Resume timer" : "pause timer"}
        </Typography> */}
            </Flex>
          </Button>
        </Box>
        <Box mb={2} mt={2} padding={4}>
          {paused ? (
            <Typography variant="h4" color="secondary" align="center">
              PAUSED
            </Typography>
          ) : (
            <Typography variant="h4" align="center">
              {activeCard?.text}
            </Typography>
          )}
        </Box>
      </Flex>
      {paused ? (
        isFresh ? (
          <Flex>
            <Flex flex="1 1 0%" marginRight={`${theme.spacing(1)}px`}>
              <Button fullWidth variant="outlined" onClick={skipTurn}>
                Skip Turn
              </Button>
            </Flex>
            <Flex flex="1 1 0%" marginLeft={`${theme.spacing(1)}px`}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={startTurn}
              >
                Start Turn
              </Button>
            </Flex>
          </Flex>
        ) : (
          <Flex>
            <Flex flex="2 2 0%" marginLeft={`${theme.spacing(1)}px`}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={startTurn}
              >
                Resume Turn
              </Button>
            </Flex>
          </Flex>
        )
      ) : (
        <Flex>
          <Flex flex="1 1 0%" marginRight={`${theme.spacing(1)}px`}>
            <Button
              fullWidth
              variant="outlined"
              onClick={skipCard}
              disabled={nCardsRemaining === 0 && nCardsSkipped <= 1}
            >
              Skip
            </Button>
          </Flex>
          <Flex flex="2 2 0%" marginLeft={`${theme.spacing(1)}px`}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={gotCard}
            >
              Got it!
            </Button>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

const Label: React.FC = ({ children }) => (
  <Typography
    style={{ fontWeight: 300, lineHeight: "36px" }}
    color="textSecondary"
    variant="h6"
  >
    {children}
  </Typography>
);

const useCountdownTimer = (): [number, VoidFunction] => {
  const dispatch = useActionDispatch();
  const paused = useGameSelector((game) => game.turns.active.paused);
  const timeRemaining = useGameSelector(
    (game) => game.turns.active.timeRemaining
  );
  const [timer, setTimer] = useState(timeRemaining);
  const interval = useRef<number>();

  useEffect(() => {
    setTimer(timeRemaining);
    if (!paused) {
      interval.current = window.setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval.current);
    };
  }, [paused, timeRemaining]);

  useEffect(() => {
    if (timer < 0) {
      dispatch({ type: "END_TURN", payload: {} });
    }
  }, [dispatch, timer]);

  const onClick = useCallback(() => {
    if (paused) {
      dispatch({ type: "START_TURN", payload: { drawSeed: Math.random() } });
    } else {
      dispatch({ type: "PAUSE_TURN", payload: { timeRemaining: timer } });
    }
  }, [dispatch, timer, paused]);

  return [timer, onClick];
};
