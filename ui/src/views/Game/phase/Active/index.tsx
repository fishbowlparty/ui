import { Flex } from "@rebass/grid/emotion";
import React from "react";
import { Content } from "../../../../components/Layout";
import { ActionButtons } from "./ActionButtons";
import { GameHeader } from "./GameHeader";
import { TimerContextProvider } from "./timer";
import { Turn } from "./Turn";

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
