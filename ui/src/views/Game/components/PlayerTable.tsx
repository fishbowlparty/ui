import React from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Link,
} from "@material-ui/core";
import styled from "@emotion/styled";

export const PlayerTable: React.FC = ({ children }) => {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table aria-label="Players">{children}</Table>
    </TableContainer>
  );
};

export const PlayerTableRow = styled(TableRow)`
  height: 52px;
`;
