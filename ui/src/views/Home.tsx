import React, { useCallback } from "react";
import { Box, Typography, Button, Link } from "@material-ui/core";
import { theme } from "../theme";
import { Flex } from "@rebass/grid/emotion";
import styled from "@emotion/styled";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { getPlayer } from "../redux/localStorage";
import { CenteredContent, Footer } from "../components/Layout";

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
    <>
      <CenteredContent>
        <Flex
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Typography
            variant="h2"
            color="secondary"
            style={{ fontWeight: "bold" }}
          >
            fish<BlueText>bowl</BlueText>
          </Typography>
          <Typography variant="body1">a party game!</Typography>
        </Flex>
        <Box mb={12} />
        <Button
          fullWidth
          component="a"
          href="https://www.youtube.com/watch?v=QO-2s4CEd1w"
          target="_blank"
        >
          How to play
        </Button>
        <Box mb={2} />
        <Button fullWidth variant="outlined" component={RouterLink} to="/join">
          Join Game
        </Button>
        <Box mb={2} />
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={createGame}
        >
          Create New Game
        </Button>
        <Box mb={2} />
      </CenteredContent>
      <Footer>
        <Flex justifyContent="center" width="100%">
          <Typography variant="caption">
            this is an{" "}
            <Link href="https://github.com/fishbowlparty/game">
              open source project
            </Link>
          </Typography>
        </Flex>
      </Footer>
    </>
  );
};

const BlueText = styled.span`
  color: ${theme.palette.primary.main};
`;
