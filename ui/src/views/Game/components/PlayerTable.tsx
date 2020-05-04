import styled from "@emotion/styled";
import { Paper, Table, TableContainer, TableRow } from "@material-ui/core";
import React from "react";

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
