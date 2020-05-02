import React, { useCallback } from "react";
import { Box, Typography, Button, TextField } from "@material-ui/core";
import { theme } from "../../../../theme";
import { Flex } from "@rebass/grid/emotion";
import styled from "@emotion/styled";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useActionDispatch, useGameSelector } from "../../../../redux";
import { getPlayer } from "../../../../redux/localStorage";
import { v4 } from "uuid";

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

  return (
    <Flex flexDirection="column" flex="1 0 auto" padding={theme.spacing(2)}>
      <Typography variant="h2">Write Your Cards</Typography>
      <Typography variant="caption">
        Using the words and phrases everyone writes on their cards, you will
        take turns giving clues and getting your team to guess what is on the
        cards. A good card will be a word or phrase that everyone in your group
        will know and understand. Be creative and think about how you can get
        some laughs!
      </Typography>
      <Box m={4}></Box>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {[...Array(cardsPerPlayer)].map((_, i) => {
          console.log(i);
          return (
            <Row key={i}>
              <Typography
                variant="body1"
                style={{ fontWeight: "bold" }}
                component="label"
                htmlFor={`cards[${i}]`}
              >
                Card #{i + 1}
              </Typography>
              <TextField
                fullWidth
                id={`cards[${i}]`}
                name={`cards[${i}]`}
                margin="dense"
                variant="outlined"
                placeholder={placeholders[i] || "..."}
                inputRef={register({
                  required: true,
                })}
              ></TextField>
            </Row>
          );
        })}

        <Flex flex="1 1 0%"></Flex>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          type="submit"
          disabled={!isValid}
        >
          Ready!
        </Button>
      </Form>
    </Flex>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
`;

const Row = styled(Flex)`
  flex-direction: column;
  margin-bottom: ${theme.spacing(2)}px;
`;
