import styled from "@emotion/styled";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Grow,
  Fade,
} from "@material-ui/core";
import { Close, Edit, Settings } from "@material-ui/icons";
import { Flex } from "@rebass/grid/emotion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { GameCode } from "../../../components/Typography";
import Clipboard from "clipboard";

export const GameInviteButton: React.FC<{ small?: boolean }> = ({ small }) => {
  const [highlighted, setHighlighted] = useState(false);
  const { params } = useRouteMatch<{ gameCode: string }>();
  const timeout = useRef<number>();

  useEffect(() => {
    const clip = new Clipboard("#CopyButton");

    clip.on("success", () => {
      setHighlighted(true);
      clearTimeout(timeout.current);
      timeout.current = window.setTimeout(() => setHighlighted(false), 1500);
    });

    return () => {
      clip.destroy();
    };
  }, [setHighlighted, timeout]);

  return (
    <Button
      id="CopyButton"
      variant="outlined"
      fullWidth={!small}
      color={small && !highlighted ? "default" : "secondary"}
      size={small ? "small" : "medium"}
      data-clipboard-text={window.location.href}
    >
      {small ? (
        <>
          <Typography color="textSecondary">
            <GameCode small>{params.gameCode}</GameCode>
          </Typography>
          <Fade in={highlighted} timeout={{ enter: 100, exit: 200 }}>
            <Flex
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                background: "white",
                borderRadius: 4,
              }}
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                variant="caption"
                align="center"
                style={{ lineHeight: "1em" }}
              >
                copied!
              </Typography>
            </Flex>
          </Fade>
        </>
      ) : (
        <Flex flexDirection="column" alignItems="center">
          <GameCode>{params.gameCode}</GameCode>
          <Typography variant="caption" align="center">
            {highlighted ? "copied!" : "copy invite link"}
          </Typography>
        </Flex>
      )}
    </Button>
  );
};
