import React from "react";
import { Content, Footer } from "../../../components/Layout";
import { AdvancePhaseButton } from "./AdvancePhaseButton";

export const LobbyPage: React.FC = ({ children }) => (
  <>
    <Content>{children}</Content>
    <Footer>
      <AdvancePhaseButton></AdvancePhaseButton>
    </Footer>
  </>
);
