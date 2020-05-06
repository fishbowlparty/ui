import React from "react";
import { Flex } from "@rebass/grid/emotion";
import { theme } from "../theme";
import { Title, Instructions } from "./Typography";
import { Box } from "@material-ui/core";
import { CenteredContent } from "../components/Layout";

export const ActionPage: React.FC<{ title: string; instructions: string }> = ({
  title,
  instructions,
  children,
}) => {
  return (
    <CenteredContent>
      <Title>{title}</Title>
      <Box mb={0.5}></Box>
      <Instructions>{instructions}</Instructions>
      <Box mb={4}></Box>
      {children}
    </CenteredContent>
  );
};
