import { keyframes } from "@emotion/core";
import styled from "@emotion/styled";
import { TeamName } from "@fishbowl/common";
import React, { useEffect, useState } from "react";
import { Score } from "../../../../components/Typography";
import { useGameSelector } from "../../../../redux";
import { useSoundContext } from "./sound";

export const ScoreSprinkler: React.FC = () => {
  const skipPenalty = useGameSelector((game) => game.settings.skipPenalty);
  const cardEvents = useGameSelector((game) => game.turns.recap.cardEvents);
  const team = useGameSelector((game) => game.turns.recap.team);
  const [scoreSprays, setScoreSprays] = useState<SprayProps[]>([]);
  const { play } = useSoundContext();

  // this is dumb, but it should work as long as none of these assumptions change:
  // cardEvents is an array, it will only grow in length over the course of a turn
  // with either cardIds (got it) or null (skipped), and then it will reset to 0
  // at the start of a new turn
  useEffect(() => {
    if (cardEvents.length === 0 && scoreSprays.length !== 0) {
      return setScoreSprays([]);
    }

    // for each event more than sprays, add a new spray
    const newSprays = cardEvents.slice(scoreSprays.length).map((event) => {
      const isSkip = event == null;
      const isPenalized = skipPenalty != 0;

      if (!isSkip) {
        play("plusOne");
      } else if (isPenalized) {
        play("minusOne");
      }

      return {
        teamColor: isSkip ? null : team,
        text: isSkip ? (!isPenalized ? null : "-1") : "+1",
      };
    });
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

interface SprayProps {
  teamColor: TeamName | null;
  text: string | null; // null means don't render - skip with no penalty
}

const Spray: React.FC<SprayProps> = React.memo(({ text, teamColor }) => {
  if (text == null) {
    return null;
  }

  return (
    <ScaleAndFade>
      <XMotion>
        <YMotion>
          <Score team={teamColor}>{text}</Score>
        </YMotion>
      </XMotion>
    </ScaleAndFade>
  );
});

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

// Randomly generated x-axis motion that moves between MIN & MAXpx, positive or negative
// I wish that I had done this by angles rather than xy px measurements
const XMIN = 10;
const XMAX = 40;
const XMotion: React.FC = React.memo(({ children }) => {
  // randomly generate initial speed and direction
  const speed = Math.random();
  const direction = Math.random() > 0.5 ? 1 : -1;

  const x_final = direction * (XMIN + speed * (XMAX - XMIN));

  const animation = keyframes`
    0% {
      transform: translateX(0px)
    }

    100% {
      transform: translateX(${x_final}px)
    }
  `;

  const Mover = styled.div`
    position: absolute;
    animation: ${animation} ${DURATION} ${EASE};
  `;

  return <Mover>{children}</Mover>;
});

// YMotion
// Randomly generate Y axis motion that rises and is pulled down by gravity
// See below for the math to  get the value for accelaration, cause I did it in
// comments like an idiot
const YMAX = -100;
const YMIN = -50;
const AY = (-YMAX * 1.3) / 100 ** 2;

const VYMAX = YMAX / 50;
const VYMIN = (YMIN + YMAX) / 100;

const YMotion: React.FC = React.memo(({ children }) => {
  const frames = [];

  const vy0 = VYMIN + Math.random() * (VYMAX - VYMIN);

  for (let i = 0; i <= 100; i++) {
    frames.push(`${i}% {
      transform: translateY(${vy0 * i + AY * i ** 2}px);
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
});

// y motion
// rise, turn & fall to YMAX - YMIN

// equations
// y(t) = vy * t + ay * t ^ 2
// vy(t) = vy + 2 * ay * t

// Find gravitational acceleration that would peak at YMAX at t=100
// That will be our basis
// vy(100) = 0
// vy + 2 * ay * 100 = 0
// ay = -vy / 200

// y(100) = YMAX
// vy * 100 + ay * 100 ^ 2 = YMAX
// vy + ay * 100 = YMAX / 100
// substitue ay from above
// vy - vy / 2 = YMAX / 100
// .5 vy = YMAX / 100

// vy = YMAX / 50
// ay = - YMAX / 100 ^ 2

// vy = 1.5, n = -1.5 / 10000

// y(100) = YMIN
// YMIN = vy * 100 - YMAX
// VYMIN = (YMIN + YMAX) / 100

// y(100) = 50
// vy * 100 + YMAX / 9 = 50
// vy = (YMIN - AY * 100 ^ 2) / 100
