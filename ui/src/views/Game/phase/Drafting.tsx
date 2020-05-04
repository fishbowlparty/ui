import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Typography,
  TableRow,
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
              <Droppable droppableId="orange">
                {(provided, snapshot) => (
                  <TableContainer
                    component={Paper}
                    variant="outlined"
                    innerRef={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      boxShadow: `0 0 4px 0px ${theme.palette.secondary.main}`,
                      background: theme.palette.background.default,
                    }}
                  >
                    <Table aria-label="Players">
                      <TableBody>
                        {teams.orange.map((playerId, i) => (
                          <PlayerTableRow key={playerId}>
                            <DraggableCell
                              player={players[playerId]}
                              index={i}
                            ></DraggableCell>
                          </PlayerTableRow>
                        ))}
                        {provided.placeholder}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Droppable>
            </Flex>
            <Flex flex="1 1 0%" marginLeft={2}>
              <Droppable droppableId="blue">
                {(provided, snapshot) => (
                  <TableContainer
                    component={Paper}
                    variant="outlined"
                    innerRef={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      // border: `1px solid ${theme.palette.primary.main}`,
                      boxShadow: `0 0 4px 0px ${theme.palette.primary.main}`,
                      background: theme.palette.background.default,
                    }}
                  >
                    <Table aria-label="Players">
                      <TableBody>
                        {teams.blue.map((playerId, i) => (
                          <PlayerTableRow key={playerId}>
                            <DraggableCell
                              player={players[playerId]}
                              index={i}
                            ></DraggableCell>
                          </PlayerTableRow>
                        ))}
                        {provided.placeholder}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Droppable>
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

const DraggableCell: React.FC<{ player: Player; index: number }> = ({
  player,
  index,
}) => {
  return (
    <Draggable key={player.id} draggableId={player.id} index={index}>
      {(provided, snapshot) => {
        console.log(snapshot.isDragging);
        return (
          <TableCell
            {...provided.draggableProps}
            style={{
              ...provided.draggableProps.style,
              opacity: snapshot.isDragging ? 0.7 : 1,
              background: theme.palette.background.paper,
            }}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {player.name}
          </TableCell>
        );
      }}
    </Draggable>
  );
};
