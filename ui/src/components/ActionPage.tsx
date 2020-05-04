import React from "react";
import { Flex } from "@rebass/grid/emotion";
import { theme } from "../theme";
import { Title, Instructions } from "./Typography";
import { Box } from "@material-ui/core";

export const ActionPage: React.FC<{ title: string; instructions: string }> = ({
  title,
  instructions,
  children,
}) => {
  return (
    <Flex
      flex="1 0 auto"
      flexDirection="column"
      padding={`${theme.spacing(2)}px`}
    >
      <Flex flex="1 1 0%"></Flex>
      <Flex flexDirection="column">
        <Title>{title}</Title>
        <Box mb={0.5}></Box>
        <Instructions>{instructions}</Instructions>
        <Box mb={4}></Box>
        {children}
      </Flex>
      <Flex flex="2 2 0%"></Flex>
    </Flex>
  );
};
