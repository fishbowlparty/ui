import { Box, Button, TextField, Typography } from "@material-ui/core";
import { Flex } from "@rebass/grid/emotion";
import React, { useCallback, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useActionDispatch } from "../../../../redux";
import { getPlayer, setPlayerName } from "../../../../redux/localStorage";
import { theme } from "../../../../theme";
import { ActionPage } from "../../../../components/ActionPage";
import { Title, Instructions } from "../../../../components/Typography";

interface FormState {
  name: string;
}

const funnyOldNames = ["Doris", "Maude", "Walter", "Chester"];

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
  const placeholder = useMemo(
    () => funnyOldNames[Math.floor(Math.random() * funnyOldNames.length)],
    []
  );

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

  useEffect(() => document.getElementById("name")?.focus(), []);

  const { isValid } = formState;
  return (
    <ActionPage
      title="Enter your name"
      instructions="Tell everyone who you are!"
    >
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <TextField
          fullWidth
          id="name"
          name="name"
          margin="normal"
          variant="outlined"
          placeholder={placeholder}
          inputRef={register({
            required: true,
          })}
          InputProps={{
            inputProps: {
              style: {
                ...theme.typography.h5,
              },
              // autoFocus: true,
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
          Save
        </Button>
      </form>
    </ActionPage>
  );
};
