import React from "react";
import { ThemeProvider, Box, Typography, Button } from "@material-ui/core";
import { theme } from "./theme";
import { Flex } from "@rebass/grid/emotion";
import styled from "@emotion/styled";

function App() {
  return (
    <ThemeProvider theme={theme}>
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
            <Button fullWidth variant="outlined">
              Join Game
            </Button>
          </Box>
          <Button fullWidth variant="contained" color="primary">
            Create New Game
          </Button>
        </Flex>
        <Flex flex="1 1 0%"></Flex>
      </Flex>
    </ThemeProvider>
  );
}

const BlueText = styled.span`
  color: ${theme.palette.primary.main};
`;

export default App;
