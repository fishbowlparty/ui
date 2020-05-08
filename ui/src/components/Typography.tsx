import React, { useState, useCallback, useMemo } from "react";
import { Typography } from "@material-ui/core";
import { TeamName } from "@fishbowl/common";
import { theme } from "../theme";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/core";
import { v4 } from "uuid";

export const Title: React.FC<{ small?: boolean }> = ({ children, small }) => (
  <Typography
    variant={small ? "h6" : "h4"}
    color="textSecondary"
    style={{ fontWeight: 300, lineHeight: small ? "48px" : undefined }}
  >
    {children}
  </Typography>
);

export const Label: React.FC<{ htmlFor?: string }> = ({
  children,
  htmlFor,
}) => (
  <Typography
    variant="body1"
    style={{ fontWeight: 600 }}
    component="label"
    htmlFor={htmlFor}
  >
    {children}
  </Typography>
);

export const Instructions: React.FC = ({ children }) => (
  <Typography variant="body1">{children}</Typography>
);

export const GameCode: React.FC<{ small?: boolean }> = ({
  children,
  small,
}) => (
  <Typography
    variant={small ? "button" : "h5"}
    style={{ fontWeight: 600, textTransform: "uppercase" }}
  >
    {children}
  </Typography>
);

export const Score: React.FC<{
  team?: TeamName;
  size?: "small" | "medium" | "large";
  bold?: boolean;
}> = ({ children, team, size, bold }) => {
  const color =
    team == null
      ? "textSecondary"
      : team === "orange"
      ? "secondary"
      : "primary";

  // default size is medium
  const variant = size == "small" ? "subtitle2" : size == "large" ? "h2" : "h6";

  return (
    <Typography
      variant={variant}
      color={color}
      style={{ fontWeight: bold ? 600 : 400 }}
    >
      {children}
    </Typography>
  );
};

const fly = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-40px) scale(0.8);
  }

  50% {
    opacity: 1;
  }

  70% {
    opacity: 1;
    transform: translateY(-80px) scale(1.4);
  }

  100% {  
    opacity: 0;
    transform: translateY(-80px) scale(1.4);
  }
`;

const AnimationWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
`;

const Animation = styled.div`
  animation: ${fly} 1.5s cubic-bezier(0.61, 1, 0.88, 1);
`;

export const AnimatedFlyout: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  return (
    <AnimationWrapper {...props}>
      <Animation>{children}</Animation>
    </AnimationWrapper>
  );
};

export const usePlusMinusAnimation = (size: "small" | "medium" = "medium") => {
  const [plusOnes, setPlusOnes] = useState<Record<string, boolean>>({});
  const [minusOnes, setMinusOnes] = useState<Record<string, boolean>>({});

  const addPlusOne = useCallback(
    () => setPlusOnes((plusOnes) => ({ ...plusOnes, [v4()]: true })),
    [setPlusOnes]
  );
  const removePlusOne = useCallback(
    (id: string) => {
      setPlusOnes((plusOnes) => {
        const { [id]: _, ...rest } = plusOnes;
        return rest;
      });
    },
    [setPlusOnes]
  );

  const addMinusOne = useCallback(
    () => setMinusOnes((minusOnes) => ({ ...minusOnes, [v4()]: true })),
    [setMinusOnes]
  );
  const removeMinusOne = useCallback(
    (id: string) => {
      setMinusOnes((minusOnes) => {
        const { [id]: _, ...rest } = minusOnes;
        return rest;
      });
    },
    [setMinusOnes]
  );

  const AnimatedPlusOnes = useMemo(
    () => () => (
      <>
        {Object.keys(plusOnes).map((id) => (
          <AnimatedFlyout key={id} onAnimationEnd={() => removePlusOne(id)}>
            <Score size={size}>+ 1</Score>
          </AnimatedFlyout>
        ))}
      </>
    ),
    [plusOnes]
  );
  const AnimatedMinusOnes = useMemo(
    () => () => (
      <>
        {Object.keys(minusOnes).map((id) => (
          <AnimatedFlyout key={id} onAnimationEnd={() => removeMinusOne(id)}>
            <Score size={size}>- 1</Score>
          </AnimatedFlyout>
        ))}
      </>
    ),
    [minusOnes]
  );

  return {
    addPlusOne,
    addMinusOne,
    AnimatedPlusOnes,
    AnimatedMinusOnes,
  };
};
