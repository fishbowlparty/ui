import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Typography,
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
                  >
                    <Table aria-label="Players">
                      <TableHead
                        style={{ background: theme.palette.secondary.main }}
                      >
                        <PlayerTableRow>
                          <TableCell
                            style={{
                              color: theme.palette.secondary.contrastText,
                              fontSize: 16,
                              fontWeight: "bold",
                            }}
                          >
                            Orange
                          </TableCell>
                        </PlayerTableRow>
                      </TableHead>
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
                  >
                    <Table aria-label="Players">
                      <TableHead
                        style={{
                          background: theme.palette.primary.main,
                        }}
                      >
                        <PlayerTableRow>
                          <TableCell
                            style={{
                              color: theme.palette.primary.contrastText,
                              fontSize: 16,
                              fontWeight: "bold",
                            }}
                          >
                            Blue
                          </TableCell>
                        </PlayerTableRow>
                      </TableHead>
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

const Label: React.FC = ({ children }) => (
  <Typography
    style={{ fontWeight: 300, lineHeight: "36px" }}
    color="textSecondary"
    variant="h6"
  >
    {children}
  </Typography>
);

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
            scope="row"
            component={Paper}
            //@ts-ignore
            square
            elevation={snapshot.isDragging ? 2 : 0}
            {...provided.draggableProps}
            style={{
              ...provided.draggableProps.style,
              opacity: snapshot.isDragging ? 0.7 : 1,
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
