import { Box, Typography, IconButton } from "@material-ui/core";
import { Flex } from "@rebass/grid/emotion";
import React from "react";
import { Instructions, Score } from "../../../../components/Typography";
import { useGameSelector } from "../../../../redux";
import { getPlayer } from "../../../../redux/localStorage";
import { theme } from "../../../../theme";
import { GameInviteButton } from "../../components/GameInviteButton";
import {
  Help,
  HelpOutline,
  VolumeMute,
  VolumeOff,
  VolumeUp,
} from "@material-ui/icons";
import { useSoundContext } from "../../../../sound";

const roundDescriptions = ["Taboo", "Charades", "One Word"];
export const GameHeader: React.FC = () => {
  const { id } = getPlayer();
  const myTeam = useGameSelector((game) =>
    game.teams.blue.includes(id) ? "blue" : "orange"
  );
  const roundNumber = useGameSelector((game) => game.round.number);
  const roundDescription = roundDescriptions[roundNumber - 1];
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

  const { isMuted, setMute } = useSoundContext();

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <Typography variant="h5">Round {roundNumber}</Typography>
          <Box mr={2}></Box>
          <IconButton
            component="a"
            href={"https://gathertogethergames.com/fishbowl"}
            target="_blank"
            size="small"
          >
            <HelpOutline></HelpOutline>
          </IconButton>
        </Flex>
        <Flex alignItems="center">
          <Box ml={2}></Box>
          <IconButton size="small" onClick={() => setMute(!isMuted)}>
            {isMuted ? <VolumeOff></VolumeOff> : <VolumeUp></VolumeUp>}
          </IconButton>
          <Box ml={2}></Box>
          <GameInviteButton small></GameInviteButton>
        </Flex>
      </Flex>
      <Instructions>{roundDescription}</Instructions>
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
      <Box mb={2}></Box>
    </>
  );
};
