import React from "react";
import styled from "@emotion/styled";
import { Flex } from "@rebass/grid/emotion";
import { theme } from "../../../theme";

export const StickyButtonFooter: React.FC = styled(Flex)`
  position: sticky;
  bottom: 0;
  padding: ${theme.spacing(2)}px;
  border-top: 1px solid ${theme.palette.divider};
  background: ${theme.palette.background.paper};
  flex: 0 0 auto;
`;
