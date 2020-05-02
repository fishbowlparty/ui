import styled from "@emotion/styled";
import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import { Flex } from "@rebass/grid/emotion";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useActionDispatch } from "../../../../redux";
import { Game } from "@fishbowl/common";

import { theme } from "../../../../theme";

interface FormState {
  turnDuration: string;
  skipPenalty: boolean;
  cardsPerPlayer: string;
}

export const Settings: React.FC = () => {
  const settings = useSelector((game: Game) => game.settings);
  const dispatch = useActionDispatch();
  const history = useHistory();
  const { params } = useRouteMatch<{ gameCode: string }>();

  const { register, handleSubmit, watch } = useForm<FormState>({
    defaultValues: {
      turnDuration: `${settings.turnDuration}`,
      cardsPerPlayer: `${settings.cardsPerPlayer}`,
      skipPenalty: settings.skipPenalty === -1,
    },
  });

  const skipPenalty = watch("skipPenalty");

  const onFormSubmit = useCallback(
    (formState: FormState) => {
      dispatch({
        type: "SET_GAME_SETTINGS",
        payload: {
          settings: {
            turnDuration: parseInt(formState.turnDuration),
            cardsPerPlayer: parseInt(formState.cardsPerPlayer),
            skipPenalty: formState.skipPenalty ? -1 : 0,
            numberOfRounds: settings.numberOfRounds,
          },
        },
      });

      history.push(`/games/${params.gameCode}`);
    },
    [dispatch, history, settings, params]
  );

  return (
    <Flex flexDirection="column" flex="1 0 auto" padding={theme.spacing(2)}>
      <Header>
        <Typography variant="h4" align="center">
          game rules
        </Typography>
      </Header>
      <Form onSubmit={handleSubmit(onFormSubmit)}>
        <Flex flex="1 0 auto" flexDirection="column">
          <Row>
            <Typography
              variant="body1"
              style={{ fontWeight: "bold" }}
              component="label"
              htmlFor="turnDuration"
            >
              Time Per Turn
            </Typography>
            <Typography
              variant="body2"
              style={{ fontWeight: "lighter" }}
              component="label"
              htmlFor="turnDuration"
            >
              how much time does each player get on their turn?
            </Typography>
            <Box width="6em">
              <TextField
                id="turnDuration"
                name="turnDuration"
                type="number"
                variant="outlined"
                margin="dense"
                inputRef={register({ required: true, min: 1 })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">s</InputAdornment>
                  ),
                  inputProps: {
                    required: true,
                    min: 1,
                  },
                }}
              ></TextField>
            </Box>
          </Row>
          <Row>
            <Typography
              variant="body1"
              style={{ fontWeight: "bold" }}
              component="label"
              htmlFor="cardsPerPlayer"
            >
              Cards Per Player
            </Typography>
            <Typography
              variant="body2"
              style={{ fontWeight: "lighter" }}
              component="label"
              htmlFor="cardsPerPlayer"
            >
              how many cards will each player need to fill out?
            </Typography>
            <Box width="6em">
              <TextField
                id="cardsPerPlayer"
                name="cardsPerPlayer"
                type="number"
                variant="outlined"
                margin="dense"
                inputRef={register({ required: true, min: 1 })}
                InputProps={{
                  inputProps: {
                    required: true,
                    min: 1,
                  },
                }}
              ></TextField>
            </Box>
          </Row>
          <Row>
            <Typography
              variant="body1"
              style={{ fontWeight: "bold" }}
              component="label"
              htmlFor="skipPenalty"
            >
              Skip Penalty
            </Typography>
            <Typography
              variant="body2"
              style={{ fontWeight: "lighter" }}
              component="label"
              htmlFor="skipPenalty"
            >
              players lose a point (-1) for their team when they skip a card
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    id="skipPenalty"
                    name="skipPenalty"
                    defaultChecked={skipPenalty}
                    inputRef={register}
                  />
                }
                label={skipPenalty ? "-1 per skip" : "no penalty"}
              />
            </FormGroup>
          </Row>
        </Flex>
        <Flex>
          <Button variant="outlined" color="primary" fullWidth type="submit">
            Save
          </Button>
        </Flex>
      </Form>
    </Flex>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
`;

const Header = styled(Flex)`
  border-bottom: 1px solid ${theme.palette.divider};
  padding-bottom: ${theme.spacing(1)}px;
  margin-bottom: ${theme.spacing(2)}px;
`;

const Row = styled(Flex)`
  flex-direction: column;
  margin-bottom: ${theme.spacing(2)}px;
`;
