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
