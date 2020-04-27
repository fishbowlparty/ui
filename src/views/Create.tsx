import React from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import { theme } from "../theme";
import { Flex } from "@rebass/grid/emotion";
import styled from "@emotion/styled";

export const Create: React.FC = () => (
  <Flex flexDirection="column" flex="1 0 auto" padding={theme.spacing(2)}>
    <Header>
      <Typography variant="h3">game settings</Typography>
    </Header>
    <Flex flex="1 0 auto" flexDirection="column">
      <Row>
        <Typography
          variant="body1"
          style={{ fontWeight: "bold" }}
          component="label"
          htmlFor="time"
        >
          Time Per Turn
        </Typography>
        <Typography
          variant="body2"
          style={{ fontWeight: "lighter" }}
          component="label"
          htmlFor="time"
        >
          how much time does each player get on their turn?
        </Typography>
        <Box width="6em">
          <TextField
            id="time"
            name="time"
            type="number"
            value={100}
            variant="outlined"
            margin="dense"
            InputProps={{
              endAdornment: <InputAdornment position="end">s</InputAdornment>,
            }}
          ></TextField>
        </Box>
      </Row>
      <Row>
        <Typography
          variant="body1"
          style={{ fontWeight: "bold" }}
          component="label"
          htmlFor="words"
        >
          Words Per Person
        </Typography>
        <Typography
          variant="body2"
          style={{ fontWeight: "lighter" }}
          component="label"
          htmlFor="words"
        >
          how many words / phrases will each player need to enter?
        </Typography>
        <Box width="6em">
          <TextField
            id="words"
            name="words"
            type="number"
            value={3}
            variant="outlined"
            margin="dense"
          ></TextField>
        </Box>
      </Row>
      <Row>
        <Typography
          variant="body1"
          style={{ fontWeight: "bold" }}
          component="label"
          htmlFor="penalizeSkip"
        >
          Skip Penalty
        </Typography>
        <Typography
          variant="body2"
          style={{ fontWeight: "lighter" }}
          component="label"
          htmlFor="penalizeSkip"
        >
          players lose a point (-1) for their team when they skip a word /
          phrase
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={true} name="penalizeSkip" />}
            label="-1 | no penalty"
          />
        </FormGroup>
      </Row>
    </Flex>
    <Flex>
      <Button fullWidth variant="outlined" color="primary">
        Save
      </Button>
    </Flex>
  </Flex>
);

const Header = styled(Flex)`
  border-bottom: 1px solid ${theme.palette.divider};
  padding-bottom: ${theme.spacing(1)}px;
  margin-bottom: ${theme.spacing(2)}px;
`;

const Row = styled(Flex)`
  flex-direction: column;
  margin-bottom: ${theme.spacing(2)}px;
`;
