import React from "react";
import { Typography } from "@material-ui/core";

export const Title: React.FC<{ small?: boolean }> = ({ children, small }) => (
  <Typography
    variant={small ? "h6" : "h4"}
    color="textSecondary"
    style={{ fontWeight: 300 }}
  >
    {children}
  </Typography>
);

export const Instructions: React.FC = ({ children }) => (
  <Typography variant="caption">{children}</Typography>
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
