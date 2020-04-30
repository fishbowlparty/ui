import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
} from "@material-ui/core";
import { Flex } from "@rebass/grid/emotion";
import React from "react";
import { useRouteMatch } from "react-router-dom";
import { useGameSelector, useActionDispatch } from "../../../redux";
import { getPlayer } from "../../../redux/localStorage";
import { theme } from "../../../theme";
import { AdvancePhaseButton } from "../components/AdvancePhaseButton";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";
import { TeamName } from "../../../redux/types";

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
        paddingBottom={theme.spacing(2)}
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Label>Choose Your Teams...</Label>
        </Flex>
        <Flex>
          <DragDropContext onDragEnd={onDragEnd}>
            <Flex flex="1 1 0%" marginRight="-1px">
              <Droppable droppableId="orange">
                {(provided, snapshot) => (
                  <List
                    innerRef={provided.innerRef}
                    style={{
                      border: `1px solid ${theme.palette.divider}`,
                      width: "100%",
                    }}
                    disablePadding
                    {...provided.droppableProps}
                  >
                    {teams.orange.map((playerId, i) => (
                      <Draggable
                        key={playerId}
                        draggableId={playerId}
                        index={i}
                      >
                        {(provided, snapshot) => (
                          <Flex
                            key={playerId}
                            {...provided.draggableProps}
                            style={{
                              border: "1px solid blue",
                              margin: "-0.5px",
                              ...provided.draggableProps.style,
                            }}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            <ListItem
                            // innerRef={provided.innerRef}
                            // {...provided.draggableProps}
                            // {...provided.dragHandleProps}
                            >
                              <ListItemText
                                primaryTypographyProps={
                                  {
                                    // style: { fontWeight: "bold" },
                                    // color: "secondary",
                                  }
                                }
                                primary={players[playerId]?.name || "..."}
                              ></ListItemText>
                            </ListItem>
                          </Flex>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </List>
                )}
              </Droppable>
            </Flex>
            <Flex flex="1 1 0%">
              <Droppable droppableId="blue">
                {(provided, snapshot) => (
                  <List
                    innerRef={provided.innerRef}
                    style={{
                      border: `1px solid ${theme.palette.divider}`,
                      width: "100%",
                    }}
                    disablePadding
                    {...provided.droppableProps}
                  >
                    {teams.blue.map((playerId, i) => (
                      <Draggable
                        key={playerId}
                        draggableId={playerId}
                        index={i}
                      >
                        {(provided, snapshot) => (
                          <ListItem
                            key={playerId}
                            innerRef={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <ListItemText
                              primaryTypographyProps={
                                {
                                  // style: { fontWeight: "bold" },
                                  // color: "primary",
                                }
                              }
                              primary={players[playerId]?.name || "..."}
                            ></ListItemText>
                          </ListItem>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </List>
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
