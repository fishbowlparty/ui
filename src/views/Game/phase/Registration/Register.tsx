import { Box, Button, TextField, Typography } from "@material-ui/core";
import { Flex } from "@rebass/grid/emotion";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useActionDispatch } from "../../../../redux";
import { getPlayer, setPlayerName } from "../../../../redux/localStorage";
import { theme } from "../../../../theme";

interface FormState {
  name: string;
}

export const Register: React.FC = () => {
  const { id, name } = getPlayer();
  // TODO: read identity & username from cookie
  const { register, handleSubmit, formState } = useForm<FormState>({
    mode: "onChange",
    defaultValues: {
      name,
    },
  });

  const dispatch = useActionDispatch();
  const history = useHistory();
  const { params } = useRouteMatch<{ gameCode: string }>();

  const onFormSubmit = useCallback(
    ({ name }: FormState) => {
      dispatch({
        type: "JOIN_GAME",
        payload: { playerId: id, name },
      });
      setPlayerName(name);
      history.push(`/games/${params.gameCode}`);
    },
    [history, dispatch, id, params]
  );

  const { isValid } = formState;

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
        <form onSubmit={handleSubmit(onFormSubmit)}>
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
            Save
          </Button>
        </form>
      </Flex>
      <Flex flex="2 2 0%"></Flex>
    </Flex>
  );
};
