import React, { useCallback } from "react";
import { Box, Typography, Button } from "@material-ui/core";
import { theme } from "../theme";
import { Flex } from "@rebass/grid/emotion";
import styled from "@emotion/styled";
import { Link, useHistory } from "react-router-dom";
import { getPlayer } from "../redux/localStorage";

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
    <Flex flexDirection="column" flex="1 0 auto" padding={theme.spacing(2)}>
      <Flex flex="1 1 0%"></Flex>
      <Flex alignItems="center" justifyContent="center">
        <Typography
          variant="h2"
          color="secondary"
          style={{ fontWeight: "bold" }}
        >
          fish<BlueText>bowl</BlueText>
        </Typography>
      </Flex>
      <Flex flex="2 2 0%"></Flex>
      <Flex flexDirection="column">
        <Box mb={2}>
          <Button fullWidth variant="outlined" component={Link} to="/join">
            Join Game
          </Button>
        </Box>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={createGame}
        >
          Create New Game
        </Button>
      </Flex>
      <Flex flex="1 1 0%"></Flex>
    </Flex>
  );
};

const BlueText = styled.span`
  color: ${theme.palette.primary.main};
`;
