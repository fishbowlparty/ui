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

export const GameInviteButton: React.FC<{ small?: boolean }> = ({ small }) => {
  const [highlighted, setHighlighted] = useState(false);
  const { params } = useRouteMatch<{ gameCode: string }>();
  const timeout = useRef<number>();

  const copyGameCode = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setHighlighted(true);
    clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => setHighlighted(false), 1500);
  }, []);

  return (
    <Box mb={1}>
      <Button
        variant="outlined"
        fullWidth={!small}
        onClick={copyGameCode}
        color={small && !highlighted ? "default" : "secondary"}
        size={small ? "small" : "medium"}
      >
        {small ? (
          <>
            <GameCode small>{params.gameCode}</GameCode>
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
    </Box>
  );
};
