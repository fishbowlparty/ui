import { selectActivePlayer, selectIsNewTurn } from "@fishbowl/common";
import { Typography } from "@material-ui/core";
import { Flex } from "@rebass/grid/emotion";
import React from "react";
import { useGameSelector } from "../../../../redux";
import { getPlayer } from "../../../../redux/localStorage";
import { theme } from "../../../../theme";
import { StretchPaper } from "../../components/StretchPaper";
import { CardArea } from "./CardArea";
import { GameTimer } from "./GameTimer";

const ANIMATION = "all 100ms cubic-bezier(0.4, 0, 0.2, 1)";

export const Turn: React.FC = ({ children }) => {
  const { id } = getPlayer();
  const isPaused = useGameSelector((game) => game.turns.active.paused);

  const activePlayer = useGameSelector(selectActivePlayer);
  const activeTeam = useGameSelector((game) => game.activePlayer.team);

  const isNewTurn = useGameSelector(selectIsNewTurn);
  const isMyTurn = activePlayer.id === id;
  const isMyTeam = useGameSelector((game) =>
    game.teams[game.activePlayer.team].includes(id)
  );

  const teammateNames = useGameSelector((game) => {
    const teamNames = game.teams[game.activePlayer.team]
      .filter((playerId) => playerId !== selectActivePlayer(game).id)
      .map((playerId) =>
        playerId === id ? "you" : game.players[playerId].name
      );

    // turn my name into "you"
    return teamNames.reduce((s, name, i) => {
      let joiner = "";
      //if this is the last name in the list there is no joiner
      if (i === teamNames.length - 1) {
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

  const activeTeamPalette =
    theme.palette[activeTeam === "orange" ? "secondary" : "primary"];
  const headerBackground = activeTeamPalette.main;
  const headerColor = activeTeamPalette.contrastText;

  const borderColor =
    theme.palette[activeTeam === "orange" ? "secondary" : "primary"].main;

  return (
    <>
      <StretchPaper
        variant="outlined"
        style={{
          borderColor: isPaused ? undefined : borderColor,
        }}
      >
        <Flex
          flexDirection="column"
          style={{
            background: headerBackground,
            padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
            transition: ANIMATION,
          }}
        >
          <Typography
            variant="h6"
            style={{
              color: headerColor,
              transition: ANIMATION,
            }}
          >
            {isNewTurn
              ? isMyTurn
                ? "You're up next!"
                : "Up next..."
              : isMyTurn
              ? "Your turn"
              : isMyTeam
              ? "You're guessing"
              : "You're spectating"}
          </Typography>
          <Typography
            variant="body1"
            style={{
              color: headerColor,
            }}
          >
            {isMyTurn ? "You are" : `${activePlayer.name} is`} giving clues to{" "}
            {teammateNames}.
          </Typography>
        </Flex>

        <GameTimer></GameTimer>
        <Flex
          flex="1 0 auto"
          flexDirection="column"
          style={{
            padding: `${theme.spacing(2)}px`,
          }}
        >
          <CardArea></CardArea>
        </Flex>
      </StretchPaper>
    </>
  );
};
