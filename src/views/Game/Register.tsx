import React, { useCallback } from "react";
import { Box, Typography, Button, TextField } from "@material-ui/core";
import { theme } from "../../theme";
import { Flex } from "@rebass/grid/emotion";
import styled from "@emotion/styled";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

interface FormState {
  name: string;
}

export const Register: React.FC = () => {
  // TODO: read identity & username from cookie
  const { register, handleSubmit, formState } = useForm<FormState>({
    mode: "onChange",
  });
  const history = useHistory();
  const onSubmit = useCallback(
    (data: FormState) => {
      console.log(data);
      history.push(`/games/${data.name}`);
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
          Your Name
        </Typography>
        <Typography variant="body1" align="center">
          Tell everyone who you are!
        </Typography>
        <Box m={4}></Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h5">
            <TextField
              fullWidth
              name="name"
              margin="normal"
              variant="outlined"
              placeholder="ABCD"
              inputRef={register({
                required: true,
              })}
              InputProps={{
                inputProps: {
                  style: {
                    textAlign: "center",
                    fontSize: theme.spacing(4),
                  },
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
            Enter Lobby
          </Button>
        </form>
      </Flex>
      <Flex flex="2 2 0%"></Flex>
    </Flex>
  );
};
