import React, { useCallback } from "react";
import { Box, Typography, Button, TextField } from "@material-ui/core";
import { theme } from "../theme";
import { Flex } from "@rebass/grid/emotion";
import styled from "@emotion/styled";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ActionPage } from "../components/ActionPage";
import { Title, Instructions } from "../components/Typography";

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
      console.log(data);
      history.push(`/games/${data.gameCode}`);
    },
    [history]
  );

  const { isValid } = formState;
  console.log(isValid);

  return (
    <ActionPage>
      <Flex flexDirection="column" alignItems="center">
        <Title>Join a game</Title>
        <Box mb={1}></Box>
        <Instructions>Got a game code? Enter it here!</Instructions>
        <Box mb={4}></Box>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                  ...theme.typography.h5,
                  textAlign: "center",
                  fontWeight: 600,
                  textTransform: "uppercase",
                },
                maxLength: 4,
              },
            }}
          ></TextField>
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
    </ActionPage>
  );
};

const Label: React.FC = ({ children }) => (
  <Typography style={{ fontWeight: 300 }} color="textSecondary" variant="h4">
    {children}
  </Typography>
);
