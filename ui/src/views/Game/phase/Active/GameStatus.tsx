import React from "react";
import { useGameSelector } from "../../../../redux";
import { getPlayer } from "../../../../redux/localStorage";
import { selectIsNewTurn, selectActivePlayer } from "@fishbowl/common";
import { Typography } from "@material-ui/core";
import { Flex } from "@rebass/grid/emotion";

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

  return (
    <Flex flexDirection="column">
      <Typography variant="h6">
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
      <Typography variant="body1">
        {isMyTurn ? "You are" : `${activePlayer.name} is`} giving clues to{" "}
        {teammateNames}.
      </Typography>
    </Flex>
  );
};
