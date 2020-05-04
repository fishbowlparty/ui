import React from "react";
import { Paper } from "@material-ui/core";
import styled from "@emotion/styled";
import { theme } from "../../../../theme";
import { useGameSelector } from "../../../../redux";
import { selectIsNewTurn } from "@fishbowl/common";

export const TurnCard: React.FC = ({ children }) => {
  const activeTeam = useGameSelector((game) => game.activePlayer.team);
  const isPaused = useGameSelector((game) => game.turns.active.paused);

  const borderColor =
    theme.palette[activeTeam === "orange" ? "secondary" : "primary"].main;
  const boxShadow = isPaused ? "none" : `0px 0px 4px 0px ${borderColor}`;

  return (
    <Card
      variant="outlined"
      style={{
        // boxShadow,
        borderColor: isPaused ? undefined : borderColor,
      }}
    >
      {children}
    </Card>
  );
};

const Card = styled(Paper)`
  padding: ${theme.spacing(2)}px;
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  margin-bottom: ${theme.spacing(2)}px;
  transition: all 100ms cubic-bezier(0.4, 0, 0.2, 1) !important;
`;
