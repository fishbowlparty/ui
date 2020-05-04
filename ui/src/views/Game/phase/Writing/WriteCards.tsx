import React, { useCallback, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import { theme } from "../../../../theme";
import { Flex } from "@rebass/grid/emotion";
import styled from "@emotion/styled";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useActionDispatch, useGameSelector } from "../../../../redux";
import { getPlayer } from "../../../../redux/localStorage";
import { v4 } from "uuid";
import { ActionPage } from "../../../../components/ActionPage";
import { Title, Instructions, Label } from "../../../../components/Typography";

const placeholders = ["Darth Vader", "Arachnophobia", "Band Camp"];

interface FormState {
  cards: string[];
}

export const WriteCards: React.FC = () => {
  const { id } = getPlayer();
  const dispatch = useActionDispatch();
  const history = useHistory();
  const { params } = useRouteMatch<{ gameCode: string }>();

  const cardsPerPlayer = useGameSelector(
    (game) => game.settings.cardsPerPlayer
  );
  const myCards = useGameSelector((game) => game.playerCards[id] || []);
  // TODO: read identity & username from cookie
  const { register, handleSubmit, formState } = useForm<FormState>({
    mode: "onChange",
    defaultValues: {
      cards: myCards.map((card) => card.text),
    },
  });

  const onSubmit = useCallback(
    ({ cards }: FormState) => {
      dispatch({
        type: "SUBMIT_CARDS",
        payload: {
          playerId: id,
          cards: cards.map((text) => ({
            id: v4(),
            text,
          })),
        },
      });
      history.push(`/games/${params.gameCode}`);
    },
    [history, dispatch, id, params]
  );

  const { isValid } = formState;
  useEffect(() => document.getElementById("cards[0]")?.focus(), []);

  return (
    <ActionPage
      title="Write your cards"
      instructions="Write words and phrases that everyone will then guess, based on clues
    from their teammates."
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {[...Array(cardsPerPlayer)].map((_, i) => {
          console.log(i);
          return (
            <Row key={i}>
              <TextField
                fullWidth
                id={`cards[${i}]`}
                name={`cards[${i}]`}
                margin="none"
                variant="outlined"
                placeholder={placeholders[i] || "..."}
                inputRef={register({
                  required: true,
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box mr={0.5}>
                        <Title small>{i + 1}</Title>
                      </Box>
                    </InputAdornment>
                  ),
                }}
              ></TextField>
            </Row>
          );
        })}
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          type="submit"
          disabled={!isValid}
        >
          Ready!
        </Button>
      </form>
    </ActionPage>
  );
};

const Row = styled(Flex)`
  flex-direction: column;
  margin-bottom: ${theme.spacing(2)}px;
`;
