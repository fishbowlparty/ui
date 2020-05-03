import React from "react";
import { useRouteMatch } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { Flex } from "@rebass/grid/emotion";
import { theme } from "../../theme";

export const NotFound: React.FC = () => {
  const { params } = useRouteMatch<{ gameCode: string }>();

  return (
    <Flex
      flex="1 0 auto"
      flexDirection="column"
      padding={`${theme.spacing(2)}px`}
    >
      <Flex flex="1 1 0%"></Flex>
      <Typography variant="h4" align="center">
        Not Found
      </Typography>
      <Typography variant="body1" align="center">
        Unable to find game {params.gameCode.toUpperCase()}. Check that your
        game code is correct and try again.
      </Typography>
      <Flex flex="2 2 0%"></Flex>
    </Flex>
  );
};
