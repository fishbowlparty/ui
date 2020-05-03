import React from "react";
import { Flex } from "@rebass/grid/emotion";
import { theme } from "../theme";

export const ActionPage: React.FC = ({ children }) => {
  return (
    <Flex
      flex="1 0 auto"
      flexDirection="column"
      padding={`${theme.spacing(2)}px`}
    >
      <Flex flex="1 1 0%"></Flex>
      {children}
      <Flex flex="2 2 0%"></Flex>
    </Flex>
  );
};
