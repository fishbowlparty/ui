import { selectActivePlayer, selectCards, TeamName } from "@fishbowl/common";
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
import { theme } from "../../../../theme";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/core";

export const ScoreSprinkler: React.FC = () => {
  const skipPenalty = useGameSelector((game) => game.settings.skipPenalty);
  const cardEvents = useGameSelector((game) => game.turns.recap.cardEvents);
  const team = useGameSelector((game) => game.turns.recap.team);
  const [scoreSprays, setScoreSprays] = useState<SprayProps[]>([]);

  // this is dumb, but it should work as long as none of my assumptions change =/
  useEffect(() => {
    if (cardEvents.length === 0 && scoreSprays.length !== 0) {
      return setScoreSprays([]);
    }

    const newSprays = cardEvents.slice(scoreSprays.length).map((event) => ({
      vxSeed: Math.random(),
      vySeed: Math.random(),
      team,
      text: event == null ? (skipPenalty == 0 ? null : "-1") : "+1",
    }));
    if (newSprays.length > 0) {
      setScoreSprays(scoreSprays.concat(newSprays));
    }
  }, [cardEvents, scoreSprays, team]);

  return (
    <AnimationWrapper>
      {scoreSprays.map((spray, i) => (
        <Spray {...spray} key={i} />
      ))}
    </AnimationWrapper>
  );
};

const AnimationWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  max-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

interface SprayProps {
  vxSeed: number;
  vySeed: number;
  team: TeamName;
  text: string | null;
}

const DURATION = "1s";
const EASE = "ease-out";

const scaleAndFade = keyframes`
  0% {
    opacity: 1;
    transform: scale(1);
  }

  70% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(1.5);
  }
`;

const ScaleAndFade = styled.div`
  animation: ${scaleAndFade} ${DURATION} ${EASE} forwards;
`;

// x motion
// min: 20px
// max: 150px
const XMIN = 20;
const XMAX = 80;
const XMotion: React.FC<{ vxSeed: number }> = React.memo(
  ({ vxSeed, children }) => {
    // seed is positive or negative
    const seed = vxSeed - 0.5;
    // finalX is positive or negative 20-150
    const finalX = (seed < 0 ? -1 : 1) * XMIN + seed * (XMAX - XMIN);

    const animation = keyframes`
    0% {
      transform: translateX(0px)
    }

    100% {
      transform: translateX(${finalX}px)
    }
  `;

    const Mover = styled.div`
      position: absolute;
      animation: ${animation} ${DURATION} ${EASE};
    `;

    return <Mover>{children}</Mover>;
  }
);

// y motion
// min: turn & fall to 50px
// max: peak at 150px

// y(t) = vy * t + ay * t ^ 2
// vy(t) = vy + ay * t

// vy(100) = 0
// vy + 2 * ay * 100 = 0
// ay = -vy / 200

// y(100) = YMAX
// vy * 100 + ay * 100 ^ 2 = YMAX
// vy + ay * 100 = YMAX / 100
// vy - vy / 2 = YMAX / 100
// .5 vy = YMAX / 100
// vy = YMAX / 50
// ay = - YMAX / 50 / 200

// vy = 1.5, n = -1.5 / 10000

// y(100) = YMIN
// YMIN = vy * 100 - YMAX
// VYMIN = (YMIN + YMAX) / 100

// y(100) = 50
// vy * 100 + YMAX / 9 = 50
// vy = (YMIN - AY * 100 ^ 2) / 100

const YMAX = -100;
const YMIN = -50;
const AY = (-YMAX * 1.3) / 50 / 200;

const VYMAX = YMAX / 50;
const VYMIN = (YMIN + YMAX) / 100;

// max: -100 / 9 +

const YMotion: React.FC<{ vySeed: number }> = React.memo(
  ({ vySeed, children }) => {
    const frames = [];

    const vy0 = VYMIN + vySeed * (VYMAX - VYMIN);

    for (let i = 0; i <= 100; i++) {
      frames.push(`${i}% {
      transform: translateY(${vy0 * i + AY * i * i}px);
    }`);
    }

    const animation = keyframes`
    ${frames.join("\n")}
  `;

    const Mover = styled.div`
      position: absolute;
      animation: ${animation} ${DURATION} ${EASE};
    `;

    return <Mover>{children}</Mover>;
  }
);

const Spray: React.FC<SprayProps> = React.memo(
  ({ vxSeed: vx0, vySeed: vy0, text, team }) => {
    if (text == null) {
      return null;
    }

    return (
      <ScaleAndFade>
        <XMotion vxSeed={vx0}>
          <YMotion vySeed={vy0}>
            <Score team={text === "-1" ? undefined : team}>{text}</Score>
          </YMotion>
        </XMotion>
      </ScaleAndFade>
    );
  }
);
