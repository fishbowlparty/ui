import { Flex } from "@rebass/grid/emotion";
import React from "react";
import { theme } from "../../../theme";
import { StickyButtonFooter } from "./StickyButtonFooter";
import { AdvancePhaseButton } from "./AdvancePhaseButton";
import { Content, Footer } from "../../../components/Layout";

export const LobbyPage: React.FC = ({ children }) => (
  <>
    <Content>{children}</Content>
    <Footer>
      <AdvancePhaseButton></AdvancePhaseButton>
    </Footer>
  </>
);
