import React, { useCallback, useEffect } from "react";
import { Box, Typography, Button, TextField, Divider } from "@material-ui/core";
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

  useEffect(() => document.getElementById("gameCode")?.focus(), []);

  return (
    <ActionPage
      title="Join a game"
      instructions="Got a game code? Enter it here!"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          id="gameCode"
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
    </ActionPage>
  );
};
