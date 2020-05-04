import { Flex } from "@rebass/grid/emotion";
import React from "react";
import { theme } from "../../../../theme";
import { ActionButtons } from "./ActionButtons";
import { GameHeader } from "./GameHeader";
import { TimerContextProvider } from "./timer";
import { TurnCard } from "./TurnCard";

export const Active: React.FC = () => {
  return (
    <TimerContextProvider>
      <Flex flex="1 0 auto" flexDirection="column" padding={theme.spacing(2)}>
        <Flex flex="1 0 auto" flexDirection="column">
          <GameHeader></GameHeader>
          <TurnCard></TurnCard>
        </Flex>
        <ActionButtons></ActionButtons>
      </Flex>
    </TimerContextProvider>
  );
};
