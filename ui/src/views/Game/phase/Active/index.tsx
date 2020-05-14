import { Flex } from "@rebass/grid/emotion";
import React from "react";
import { theme } from "../../../../theme";
import { ActionButtons } from "./ActionButtons";
import { GameHeader } from "./GameHeader";
import { TimerContextProvider } from "./timer";
import { Turn } from "./Turn";
import { Content } from "../../../../components/Layout";

export const Active: React.FC = () => {
  return (
    <TimerContextProvider>
      <Content>
        <Flex flexDirection="column" style={{ minHeight: "100%" }}>
          <GameHeader></GameHeader>
          <Turn></Turn>
        </Flex>
      </Content>
      <ActionButtons></ActionButtons>
    </TimerContextProvider>
  );
};
