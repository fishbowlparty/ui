import React, { useCallback } from "react";
import { Box, Typography, Button } from "@material-ui/core";
import { theme } from "../theme";
import { Flex } from "@rebass/grid/emotion";
import styled from "@emotion/styled";
import { Link, useHistory } from "react-router-dom";
import { getPlayer } from "../redux/localStorage";
import { CenteredContent } from "../components/Layout";

export const Home: React.FC = () => {
  const { id } = getPlayer();
  const history = useHistory();
  // TODO: deal with async / failure
  const createGame = useCallback(async () => {
    const response = await fetch("/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hostId: id }),
    });

    const { gameCode } = await response.json();

    history.push(`/games/${gameCode}`);
  }, [history]);

  return (
    <CenteredContent>
      <Flex alignItems="center" justifyContent="center">
        <Typography
          variant="h2"
          color="secondary"
          style={{ fontWeight: "bold" }}
        >
          fish<BlueText>bowl</BlueText>
        </Typography>
      </Flex>
      <Box mb={8}></Box>
      <Box mb={2}>
        <Button fullWidth variant="outlined" component={Link} to="/join">
          Join Game
        </Button>
      </Box>
      <Button fullWidth variant="outlined" color="primary" onClick={createGame}>
        Create New Game
      </Button>
    </CenteredContent>
  );
};

const BlueText = styled.span`
  color: ${theme.palette.primary.main};
`;
