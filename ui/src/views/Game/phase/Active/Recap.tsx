import { selectCards } from "@fishbowl/common";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Typography,
} from "@material-ui/core";
import React from "react";
import { Score } from "../../../../components/Typography";
import { useGameSelector } from "../../../../redux";
import { theme } from "../../../../theme";
import { PlayerTableRow } from "../../components/PlayerTable";

const badTurnPhrases = [
  "sooooo, you get what we're doing here, right?",
  "yikes",
  "(╯°□°)╯︵ ┻━┻",
  "don't worry, it wasn't your fault",
  "I'm not mad, I'm just disappointed",
];

export const Recap: React.FC = () => {
  // I want to choose a random phrase but I need a deterministic way to be consistent across all clients
  const badTurnSeed = useGameSelector(
    (game) =>
      Object.keys(game.round.guessedCardIds).length +
      game.activePlayer.team.length
  );
  const badTurnPhrase = badTurnPhrases[badTurnSeed % badTurnPhrases.length];

  const skipPenalty = useGameSelector((game) => game.settings.skipPenalty);
  const recap = useGameSelector((game) => game.turns.recap);
  const cards = useGameSelector(selectCards);
  const pointTotal = recap.cardEvents.reduce(
    (sum, cardEvent) => sum + (cardEvent == null ? skipPenalty : 1),
    0
  );

  const teamColor =
    theme.palette[recap.team === "orange" ? "secondary" : "primary"].main;

  return (
    <>
      <TableContainer
        component={Paper}
        variant="outlined"
        style={{ borderColor: teamColor, marginBottom: theme.spacing(1) }}
      >
        <Table aria-label="Players">
          <TableBody>
            {pointTotal <= 0 && (
              <PlayerTableRow>
                <TableCell scope="row" align="center" colSpan={2}>
                  <Typography
                    variant="body2"
                    style={{ fontWeight: 300 }}
                    color="textSecondary"
                  >
                    {badTurnPhrase}
                  </Typography>
                </TableCell>
              </PlayerTableRow>
            )}
            {recap.cardEvents.length == 0 ? (
              <>
                <PlayerTableRow>
                  <TableCell scope="row" align="center">
                    <Score team={recap.team} size="small">
                      0 points
                    </Score>
                  </TableCell>
                </PlayerTableRow>
              </>
            ) : (
              <>
                {recap.cardEvents.map((cardId, i) => (
                  <PlayerTableRow key={i}>
                    <TableCell scope="row">
                      {cardId == null ? (
                        <Typography
                          variant="body2"
                          style={{ fontWeight: 300, fontStyle: "italic" }}
                          color="textSecondary"
                        >
                          skipped
                        </Typography>
                      ) : (
                        cards[cardId].text
                      )}
                    </TableCell>
                    <TableCell scope="row" align="right">
                      {cardId == null ? (
                        skipPenalty == 0 ? null : (
                          <Score size="small">-1</Score>
                        )
                      ) : (
                        <Score size="small">+1</Score>
                      )}
                    </TableCell>
                  </PlayerTableRow>
                ))}
                <PlayerTableRow>
                  <TableCell scope="row" align="right"></TableCell>
                  <TableCell scope="row" align="right">
                    <Score size="small" team={recap.team}>
                      ={pointTotal}
                    </Score>
                  </TableCell>
                </PlayerTableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
