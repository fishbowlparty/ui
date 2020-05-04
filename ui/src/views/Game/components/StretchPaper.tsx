import styled from "@emotion/styled";
import { Paper } from "@material-ui/core";
import { theme } from "../../../theme";

const ANIMATION = "all 100ms cubic-bezier(0.4, 0, 0.2, 1)";

export const StretchPaper = styled(Paper)`
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  transition: ${ANIMATION} !important;
`;
