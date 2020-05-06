import styled from "@emotion/styled";
import { theme } from "../theme";

export const Grid = styled.div`
  min-height: 100%;
  display: grid;
  grid-template-rows: [top-line] 1fr auto 2fr [footer-line] auto;
  grid-template-areas:
    "."
    "content-centered"
    "."
    "footer";
  box-shadow: ${theme.shadows[4]};
`;

export const Content = styled.div`
  grid-column: 0/1;
  grid-row: top-line / footer-line;
  padding: ${theme.spacing(2)}px;
  position: relative;
`;

export const CenteredContent = styled.div`
  grid-area: content-centered;
  padding: ${theme.spacing(2)}px;
`;

export const Footer = styled.div`
  grid-area: footer;
  position: sticky;
  bottom: 0;
  padding: ${theme.spacing(2)}px;
  border-top: 1px solid ${theme.palette.divider};
  background: ${theme.palette.background.paper};
  display: flex;
`;
