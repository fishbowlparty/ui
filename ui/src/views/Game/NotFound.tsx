import React from "react";
import { useRouteMatch } from "react-router-dom";
import { Typography, Box } from "@material-ui/core";
import { Flex } from "@rebass/grid/emotion";
import { theme } from "../../theme";
import { GameCode, Title, Instructions } from "../../components/Typography";

export const NotFound: React.FC = () => {
  const { params } = useRouteMatch<{ gameCode: string }>();

  return (
    <Flex
      flex="1 0 auto"
      flexDirection="column"
      padding={`${theme.spacing(2)}px`}
    >
      <Flex flex="1 1 0%"></Flex>
      <Title>Not Found</Title>
      <GameCode>{params.gameCode}</GameCode>
      <Box mb={4}></Box>
      <Instructions>
        Unable to find game. Check that your game code is correct and try again.
      </Instructions>
      <Flex flex="2 2 0%"></Flex>
    </Flex>
  );
};
