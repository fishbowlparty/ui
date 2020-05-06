import React from "react";
import { useRouteMatch } from "react-router-dom";
import { Typography, Box } from "@material-ui/core";
import { Flex } from "@rebass/grid/emotion";
import { theme } from "../../theme";
import { GameCode, Title, Instructions } from "../../components/Typography";
import { ActionPage } from "../../components/ActionPage";

export const NotFound: React.FC = () => {
  const { params } = useRouteMatch<{ gameCode: string }>();

  return (
    <ActionPage
      title="Not Found"
      instructions="Unable to find game. Check that your game code is correct and try again."
    >
      <Box mb={4}></Box>
      <GameCode>{params.gameCode}</GameCode>
    </ActionPage>
  );
};
