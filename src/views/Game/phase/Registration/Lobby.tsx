import styled from "@emotion/styled";
import {
  Button,
  IconButton,
  List,
  Typography,
  Box,
  ListItem,
  ListItemText,
  Divider,
  ListItemSecondaryAction,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import {
  RemoveCircleOutlineOutlined,
  Remove,
  Close,
  Edit,
  Settings,
} from "@material-ui/icons";
import { Flex } from "@rebass/grid/emotion";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { Link, useHistory, useRouteMatch, Redirect } from "react-router-dom";
import { useActionDispatch, useGameSelector } from "../../../../redux";
import { getPlayer, setPlayerName } from "../../../../redux/localStorage";
import { theme } from "../../../../theme";
import { useDispatch } from "react-redux";
import { AdvancePhaseButton } from "../../components/AdvancePhaseButton";

export const Lobby: React.FC = () => {
  const { id, name } = getPlayer();

  const dispatch = useActionDispatch();
  const match = useRouteMatch<{
    gameCode: string;
  }>();
  const { url } = match;

  const hostId = useGameSelector((game) => game.hostId);
  const players = useGameSelector((game) => game.players);
  const isHost = id === hostId;
  const isMe = useCallback((playerId: string) => id === playerId, [id]);

  const rulesDescription = useGameSelector((game) => {
    const {
      cardsPerPlayer,
      numberOfRounds,
      skipPenalty,
      turnDuration,
    } = game.settings;

    return [
      `${numberOfRounds} rounds`,
      `${cardsPerPlayer} cards per player`,
      `${turnDuration} second turns`,
      `skips are ${skipPenalty === -1 ? "-1 points" : "free"}`,
    ].join(", ");
  });

  useEffect(() => {
    dispatch({ type: "JOIN_GAME", payload: { playerId: id, name } });
  }, [dispatch, id, name]);

  const removeFromGame = useCallback(
    (playerId) => {
      dispatch({ type: "LEAVE_GAME", payload: { playerId } });
    },
    [dispatch]
  );

  if (name === "") {
    return (
      <Redirect to={`/games/${match.params.gameCode}/register`}></Redirect>
    );
  }

  return (
    <Flex flexDirection="column" flex="1 0 auto" padding={theme.spacing(2)}>
      <Flex flexDirection="column" marginBottom={`${theme.spacing(2)}px`}>
        <Label>Game Lobby</Label>
        <CopyGameCodeButton
          gameCode={match.params.gameCode}
        ></CopyGameCodeButton>
        {isHost && (
          <Typography variant="caption">
            You are the host. Use this invite link to let your friends join. You
            will control this game's rules and when the game starts. Have fun!
          </Typography>
        )}
      </Flex>
      <Flex flexDirection="column" marginBottom={`${theme.spacing(2)}px`}>
        <Flex alignItems="center" justifyContent="space-between">
          <Label>Rules</Label>
          {isHost && (
            <IconButton
              component={Link}
              to={`${url}/settings`}
              style={{ marginRight: 16 }}
            >
              <Settings></Settings>
            </IconButton>
          )}
        </Flex>
        <Typography variant="caption">{rulesDescription}</Typography>
      </Flex>

      <Flex flex="1 0 auto" flexDirection="column">
        <Flex alignItems="center" justifyContent="space-between">
          <Label>Players</Label>
        </Flex>
        <TableContainer component={Paper}>
          <Table aria-label="Players">
            <TableBody>
              {players.map((player, i) => (
                <TableRow key={player.id}>
                  <TableCell component="th" scope="row">
                    {player.name}
                  </TableCell>
                  <TableCell align="right">
                    {isMe(player.id) ? (
                      <IconButton
                        component={Link}
                        to={`${url}/register`}
                        style={{ margin: "-16px" }}
                      >
                        <Edit></Edit>
                      </IconButton>
                    ) : (
                      isHost && (
                        <IconButton
                          onClick={() => removeFromGame(player.id)}
                          style={{ margin: "-16px" }}
                        >
                          <Close></Close>
                        </IconButton>
                      )
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Flex>
      <Flex>
        <AdvancePhaseButton></AdvancePhaseButton>
      </Flex>
    </Flex>
  );
};

const CopyGameCodeButton: React.FC<{ gameCode: string }> = ({ gameCode }) => {
  const [highlighted, setHighlighted] = useState(false);
  const timeout = useRef<number>();

  const copyGameCode = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setHighlighted(true);
    clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => setHighlighted(false), 1500);
  }, []);

  return (
    <Box mb={1}>
      <Button
        variant="outlined"
        fullWidth
        onClick={copyGameCode}
        color="secondary"
      >
        <Flex flexDirection="column" alignItems="center">
          <Typography variant="h5">{gameCode}</Typography>
          <Typography variant="caption" align="center">
            {highlighted ? "copied!" : "copy invite link"}
          </Typography>
        </Flex>
      </Button>
    </Box>
  );
};

const Label: React.FC = ({ children }) => (
  <Typography
    style={{ fontWeight: 300, lineHeight: "36px" }}
    color="textSecondary"
    variant="h6"
  >
    {children}
  </Typography>
);

const Header = styled(Flex)`
  flex-direction: column;
  border-bottom: 1px solid ${theme.palette.divider};
  padding-bottom: ${theme.spacing(1)}px;
  margin-bottom: ${theme.spacing(2)}px;
`;
