import React from "react";
import { Box, Typography, Button } from "@material-ui/core";
import { theme } from "../theme";
import { Flex } from "@rebass/grid/emotion";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

export const Home: React.FC = () => (
  <Flex flexDirection="column" flex="1 0 auto" padding={theme.spacing(2)}>
    <Flex flex="1 1 0%"></Flex>
    <Flex alignItems="center" justifyContent="center">
      <Typography variant="h2" color="secondary" style={{ fontWeight: "bold" }}>
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
        variant="contained"
        color="primary"
        component={Link}
        to="/create"
      >
        Create New Game
      </Button>
    </Flex>
    <Flex flex="1 1 0%"></Flex>
  </Flex>
);

const BlueText = styled.span`
  color: ${theme.palette.primary.main};
`;
