import React from "react";
import { useGameSelector } from "../../../../redux";
import { getPlayer } from "../../../../redux/localStorage";
import { selectIsNewTurn, selectActivePlayer } from "@fishbowl/common";
import { Typography, Box } from "@material-ui/core";
import { Flex } from "@rebass/grid/emotion";
import { theme } from "../../../../theme";

/*
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
*/

export const GameStatus: React.FC = () => {
  const { id } = getPlayer();
  const isNewTurn = useGameSelector(selectIsNewTurn);
  const isMyTurn = useGameSelector(
    (game) => selectActivePlayer(game).id === id
  );
  const isMyTeam = useGameSelector((game) =>
    game.teams[game.activePlayer.team].includes(id)
  );
  const activePlayer = useGameSelector(selectActivePlayer);
  const activeTeam = useGameSelector((game) => game.activePlayer.team);

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
  const headerBackground = isMyTeam ? activeTeamPalette.main : undefined;
  const headerColor = isMyTeam ? activeTeamPalette.contrastText : undefined;

  return (
    <Flex flexDirection="column">
      <Flex
        style={{
          background: headerBackground,
          margin: `-${theme.spacing(2)}px -${theme.spacing(
            2
          )}px 0 -${theme.spacing(2)}px`,
          padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
          borderBottom: `1px solid ${
            isMyTeam ? headerBackground : theme.palette.divider
          }`,
          transition: "all 100ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Typography
          variant="h6"
          style={{
            color: headerColor,
            transition: "all 100ms cubic-bezier(0.4, 0, 0.2, 1)",
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
      </Flex>
      <Box mb={1}></Box>
      <Typography variant="body1">
        {isMyTurn ? "You are" : `${activePlayer.name} is`} giving clues to{" "}
        {teammateNames}.
      </Typography>
      <Box mb={2}></Box>
    </Flex>
  );
};
