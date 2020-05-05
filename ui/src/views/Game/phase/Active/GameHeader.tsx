import { Typography, Box } from "@material-ui/core";
import { Flex } from "@rebass/grid/emotion";
import React from "react";
import { useGameSelector } from "../../../../redux";
import { theme } from "../../../../theme";
import { GameInviteButton } from "../../components/GameInviteButton";
import { Title, Score } from "../../../../components/Typography";

export const GameHeader: React.FC = () => {
  const roundNumber = useGameSelector((game) => game.round.number);
  const nCards = useGameSelector(
    (game) => Object.values(game.playerCards).flat().length
  );
  const nCardsGuessed = useGameSelector(
    (game) => Object.keys(game.round.guessedCardIds).length
  );

  // want to remove guessed cards from skipped cards
  const nCardsSkipped = useGameSelector(
    (game) =>
      Object.keys(game.turns.active.skippedCardIds).filter(
        (cardId) => !game.round.guessedCardIds[cardId]
      ).length
  );
  const nCardsRemaining = nCards - nCardsGuessed - nCardsSkipped;
  const score = useGameSelector((game) => game.score);

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Round {roundNumber}</Typography>
        <GameInviteButton small></GameInviteButton>
      </Flex>
      <Box mb={1}></Box>
      <Flex>
        <Flex flex="1 1 0%" alignItems="center" flexDirection="column">
          <Typography
            style={{ fontWeight: 300, lineHeight: "36px" }}
            color="textSecondary"
            variant="body1"
          >
            Cards Left
          </Typography>
          <Flex width="100%">
            <Flex
              flex="1 0 auto"
              justifyContent="flex-end"
              marginRight={`${theme.spacing(1)}px`}
            >
              <Typography variant="h6">{nCardsRemaining}</Typography>
            </Flex>
            <Typography variant="h6">/</Typography>
            <Flex flex="1 0 auto" marginLeft={`${theme.spacing(1)}px`}>
              <Typography variant="h6">{nCards}</Typography>
            </Flex>
          </Flex>
          <Typography variant="caption" color="textSecondary">
            &nbsp;{nCardsSkipped > 0 && `${nCardsSkipped} skipped`}&nbsp;
          </Typography>
        </Flex>
        <Flex flex="1 1 0%" alignItems="center" flexDirection="column">
          <Typography
            style={{ fontWeight: 300, lineHeight: "36px" }}
            color="textSecondary"
            variant="body1"
          >
            Score
          </Typography>
          <Flex width="100%">
            <Flex
              flex="1 0 auto"
              justifyContent="flex-end"
              marginRight={`${theme.spacing(1)}px`}
            >
              <Score team="orange">{score.orange}</Score>
            </Flex>
            <Flex flex="1 0 auto" marginLeft={`${theme.spacing(1)}px`}>
              <Score team="blue">{score.blue}</Score>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Box mb={1}></Box>
    </>
  );
};
