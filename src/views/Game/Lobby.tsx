import React from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  FormGroup,
  FormControlLabel,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
} from "@material-ui/core";
import { theme } from "../../theme";
import { Flex } from "@rebass/grid/emotion";
import styled from "@emotion/styled";
import { Player } from "../../types";

export const Lobby: React.FC = () => {
  const players: Player[] = [
    { id: "1", name: "Erin" },
    { id: "2", name: "Caitlin" },
    { id: "3", name: "Chris" },
    { id: "4", name: "Sarah" },
    { id: "5", name: "Dan" },
  ];

  return (
    <Flex flexDirection="column" flex="1 0 auto" padding={theme.spacing(2)}>
      <Header>
        <Typography variant="h4">game lobby</Typography>
      </Header>
      <Header>
        <Flex justifyContent="space-between" alignItems="center">
          <Typography variant="h3">BGGO</Typography>
          <Button variant="outlined">Copy Link</Button>
        </Flex>
      </Header>

      <Flex flex="1 0 auto" flexDirection="column">
        <List subheader={<ListSubheader>Players</ListSubheader>}>
          {players.map((player) => (
            <ListItem key={player.id} button>
              <ListItemText primary={player.name || "..."} />
            </ListItem>
          ))}
        </List>
      </Flex>
      <Flex>
        <Button fullWidth variant="outlined" color="primary">
          Start Game
        </Button>
      </Flex>
    </Flex>
  );
};

const Header = styled(Flex)`
  flex-direction: column;
  border-bottom: 1px solid ${theme.palette.divider};
  padding-bottom: ${theme.spacing(1)}px;
  margin-bottom: ${theme.spacing(2)}px;
`;
