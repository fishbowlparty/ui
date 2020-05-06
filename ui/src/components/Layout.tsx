import styled from "@emotion/styled";
import { theme } from "../theme";

export const Grid = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto 2fr auto;
  grid-template-areas:
    "content"
    "."
    "content-centered"
    "."
    "footer";
`;

export const Content = styled.div`
  grid-area: content;
  padding: ${theme.spacing(2)}px;
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
`;
