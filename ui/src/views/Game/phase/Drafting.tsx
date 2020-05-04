import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Typography,
  TableRow,
  Divider,
} from "@material-ui/core";
import { Flex } from "@rebass/grid/emotion";
import React from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";
import { useActionDispatch, useGameSelector } from "../../../redux";
import { Player, TeamName } from "@fishbowl/common";

import { getPlayer } from "../../../redux/localStorage";
import { theme } from "../../../theme";
import { AdvancePhaseButton } from "../components/AdvancePhaseButton";
import { PlayerTableRow } from "../components/PlayerTable";
import { Title } from "../../../components/Typography";
import styled from "@emotion/styled";

/*
Make color neutral when dragging or change when crossing borders
Try different list border colors
Think about List with and without borders across this and the lobby
*/
export const Drafting: React.FC = () => {
  const { id } = getPlayer();

  const players = useGameSelector((game) => game.players);
  const teams = useGameSelector((game) => game.teams);
  const dispatch = useActionDispatch();

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    console.log(result);
    const { draggableId, source, destination } = result;
    if (destination?.droppableId == null) {
      return;
    }
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const src = source.droppableId as TeamName;
    const dst = destination.droppableId as TeamName;
    const nextTeams = {
      orange: [...teams.orange],
      blue: [...teams.blue],
    };
    nextTeams[src].splice(source.index, 1);
    nextTeams[dst].splice(destination.index, 0, draggableId);

    dispatch({ type: "SET_TEAMS", payload: { teams: nextTeams } });
  };

  return (
    <Flex flexDirection="column" flex="1 0 auto" padding={theme.spacing(2)}>
      <Flex
        flex="1 0 auto"
        flexDirection="column"
        marginBottom={`${theme.spacing(2)}px`}
      >
        <Title small>Choose Teams</Title>
        <Flex>
          <DragDropContext onDragEnd={onDragEnd}>
            <Flex flex="1 1 0%" marginRight={2}>
              <TeamDroppable team="orange"></TeamDroppable>
            </Flex>
            <Flex flex="1 1 0%" marginLeft={2}>
              <TeamDroppable team="blue"></TeamDroppable>
            </Flex>
          </DragDropContext>
        </Flex>
      </Flex>
      <Flex>
        <AdvancePhaseButton></AdvancePhaseButton>
      </Flex>
    </Flex>
  );
};

const TeamDroppable: React.FC<{ team: TeamName }> = ({ team }) => {
  const players = useGameSelector((game) => game.players);
  const teams = useGameSelector((game) => game.teams);

  return (
    <Droppable droppableId={team}>
      {(provided, snapshot) => (
        <Paper
          variant="outlined"
          innerRef={provided.innerRef}
          {...provided.droppableProps}
          style={{
            flex: "1 1 0%",
            boxShadow: `0 0 4px 0px ${
              theme.palette[team === "orange" ? "secondary" : "primary"].main
            }`,
            background: theme.palette.background.default,
          }}
        >
          {teams[team].map((playerId, i) => (
            <DraggableCell player={players[playerId]} index={i}></DraggableCell>
          ))}
          {provided.placeholder}
        </Paper>
      )}
    </Droppable>
  );
};

const DraggableCell: React.FC<{ player: Player; index: number }> = ({
  player,
  index,
}) => {
  return (
    <Draggable key={player.id} draggableId={player.id} index={index}>
      {(provided, snapshot) => {
        console.log(snapshot.isDragging);
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Cell isDragging={snapshot.isDragging && !snapshot.isDropAnimating}>
              <Typography variant="body2">{player.name}</Typography>
            </Cell>
          </div>
        );
      }}
    </Draggable>
  );
};

const Cell = styled(Flex)<{ isDragging?: boolean }>`
  padding: 16px;
  transition: all 100ms ease-out;
  background: ${theme.palette.background.paper};
  border-bottom: 1px solid transparent;
  border-color: ${(p) =>
    p.isDragging ? "transparent" : theme.palette.divider};
  /* opacity: ${(p) => (p.isDragging ? 0.85 : 1)}; */
  box-shadow: ${(p) => (p.isDragging ? theme.shadows[2] : "none")};
  transform: ${(p) =>
    p.isDragging ? "perspective(100px) translateZ(5px)" : "none"};
`;
