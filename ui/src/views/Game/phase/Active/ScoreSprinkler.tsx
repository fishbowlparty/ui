import { selectActivePlayer, selectCards } from "@fishbowl/common";
import { Box, Typography } from "@material-ui/core";
import { Flex } from "@rebass/grid/emotion";
import React, { useEffect, useState, useCallback } from "react";
import { useGameSelector } from "../../../../redux";
import { getPlayer } from "../../../../redux/localStorage";
import { Recap } from "./Recap";
import {
  usePlusMinusAnimation,
  AnimatedFlyout,
  Score,
} from "../../../../components/Typography";
import { v4 } from "uuid";

// TODO: this

export const ScoreSprinkler: React.FC = () => {
  const cardEvents = useGameSelector((game) => game.turns.recap.cardEvents);
  const [scoreSprays, setScoreSprays] = useState<SprayProps[]>([]);

  // this is dumb
  useEffect(() => {
    if (cardEvents.length === 0 && scoreSprays.length !== 0) {
      return setScoreSprays([]);
    }

    const newSprays = cardEvents.slice(scoreSprays.length).map((_) => ({
      vx0: 1,
      vy0: 1,
    }));
    if (newSprays.length > 0) {
      setScoreSprays(scoreSprays.concat(newSprays));
    }
  }, [cardEvents, scoreSprays]);

  return (
    <Flex
      flexDirection="column"
      flex="1 0 auto"
      style={{ position: "relative" }}
    >
      {scoreSprays.map((spray, i) => (
        <AnimatedFlyout key={i}>
          <Score team="orange">+ 1</Score>
        </AnimatedFlyout>
      ))}
    </Flex>
  );
};

interface SprayProps {
  vx0: number;
  vy0: number;
}

const Spray: React.FC<SprayProps> = ({ vx0, vy0 }) => {
  return <div></div>;
};
