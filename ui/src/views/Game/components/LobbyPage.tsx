import { Flex } from "@rebass/grid/emotion";
import React from "react";
import { theme } from "../../../theme";
import { StickyButtonFooter } from "./StickyButtonFooter";
import { AdvancePhaseButton } from "./AdvancePhaseButton";

export const LobbyPage: React.FC = ({ children }) => (
  <Flex flexDirection="column" flex="1 0 auto">
    <Flex flex="1 0 auto" flexDirection="column" padding={theme.spacing(2)}>
      {children}
    </Flex>
    <StickyButtonFooter>
      <AdvancePhaseButton></AdvancePhaseButton>
    </StickyButtonFooter>
  </Flex>
);
