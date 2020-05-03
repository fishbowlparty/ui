import React, { useCallback } from "react";
import { Box, Typography, Button, TextField } from "@material-ui/core";
import { theme } from "../theme";
import { Flex } from "@rebass/grid/emotion";
import styled from "@emotion/styled";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

interface FormState {
  gameCode: string;
}

export const Join: React.FC = () => {
  const { register, handleSubmit, formState } = useForm<FormState>({
    mode: "onChange",
  });
  const history = useHistory();
  const onSubmit = useCallback(
    (data: FormState) => {
      const gameCode = data.gameCode.toUpperCase();
      history.push(`/games/${gameCode}`);
    },
    [history]
  );

  const { isValid } = formState;
  console.log(isValid);

  return (
    <Flex flexDirection="column" flex="1 0 auto" padding={theme.spacing(2)}>
      <Flex flex="1 1 0%"></Flex>
      <Flex flexDirection="column">
        <Typography variant="h2" align="center">
          join a game
        </Typography>
        <Typography variant="body1" align="center">
          Got a game code? Enter it here!
        </Typography>
        <Box m={4}></Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h5">
            <TextField
              fullWidth
              name="gameCode"
              margin="normal"
              variant="outlined"
              placeholder="ABCD"
              inputRef={register({
                required: true,
                maxLength: 4,
                minLength: 4,
              })}
              InputProps={{
                inputProps: {
                  style: {
                    ...theme.typography.h3,
                    textAlign: "center",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  },
                  maxLength: 4,
                },
              }}
            ></TextField>
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            type="submit"
            disabled={!isValid}
          >
            Join Game
          </Button>
        </form>
      </Flex>
      <Flex flex="2 2 0%"></Flex>
    </Flex>
  );
};
