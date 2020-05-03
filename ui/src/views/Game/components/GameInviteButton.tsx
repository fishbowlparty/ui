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
} from "@material-ui/core";
import { Close, Edit, Settings } from "@material-ui/icons";
import { Flex } from "@rebass/grid/emotion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouteMatch } from "react-router-dom";

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
        color={small ? "default" : "secondary"}
        size={small ? "small" : "medium"}
      >
        {small ? (
          highlighted ? (
            "copied!"
          ) : (
            params.gameCode
          )
        ) : (
          <Flex flexDirection="column" alignItems="center">
            <Typography variant="h5">{params.gameCode}</Typography>
            <Typography variant="caption" align="center">
              {highlighted ? "copied!" : "copy invite link"}
            </Typography>
          </Flex>
        )}
      </Button>
    </Box>
  );
};
