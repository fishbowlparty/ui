import React from "react";
import { Box, Typography, Button, TextField } from "@material-ui/core";
import { theme } from "../../theme";
import { Flex } from "@rebass/grid/emotion";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

export const Join: React.FC = () => (
  <Flex flexDirection="column" flex="1 0 auto" padding={theme.spacing(2)}>
    <Flex flex="1 1 0%"></Flex>
    <Flex flexDirection="column">
      <Typography variant="h2" align="center">
        Your Name
      </Typography>
      <Typography variant="body1" align="center">
        Tell everyone who you are!
      </Typography>
      <Box m={4} width="100%"></Box>
      <Typography variant="h5">
        <TextField
          fullWidth
          margin="normal"
          variant="outlined"
          InputProps={{
            inputProps: {
              style: {
                textAlign: "center",
              },
            },
          }}
        ></TextField>
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/create">
        Join Game
      </Button>
    </Flex>
    <Flex flex="2 2 0%"></Flex>
  </Flex>
);
