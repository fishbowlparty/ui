import React from "react";
import { Typography } from "@material-ui/core";
import { TeamName } from "@fishbowl/common";
import { theme } from "../theme";

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
}> = ({ team, size, bold }) => {
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
      0 points
    </Typography>
  );
};
