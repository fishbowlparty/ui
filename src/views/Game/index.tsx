import React from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { Flex } from "@rebass/grid/emotion";
import { Register } from "./Register";
import { Lobby } from "./Lobby";
import { Write } from "./Write";

interface Game {}

export const Game: React.FC<RouteComponentProps<{ id: string }>> = () => {
  return <Lobby></Lobby>;
};
