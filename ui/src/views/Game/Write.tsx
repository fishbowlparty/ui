import React, { useCallback } from "react";
import { Box, Typography, Button, TextField } from "@material-ui/core";
import { theme } from "../../theme";
import { Flex } from "@rebass/grid/emotion";
import styled from "@emotion/styled";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

interface FormState {
  name: string;
}

export const Write: React.FC = () => {
  // TODO: read identity & username from cookie
  const { register, handleSubmit, formState } = useForm<FormState>({
    mode: "onChange",
  });
  const history = useHistory();
  const onSubmit = useCallback(
    (data: FormState) => {
      console.log(data);
      history.push(`/games/${data.name}`);
    },
    [history]
  );

  const { isValid } = formState;
  console.log(isValid);

  return (
    <Flex flexDirection="column" flex="1 0 auto" padding={theme.spacing(2)}>
      <Typography variant="h2" align="center">
        Write Your Cards
      </Typography>
      <Typography variant="body1" align="center">
        Do it to it!
      </Typography>
      <Box m={4}></Box>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Typography
            variant="body1"
            style={{ fontWeight: "bold" }}
            component="label"
            htmlFor="card-1"
          >
            Card #1
          </Typography>
          <TextField
            fullWidth
            id="card-1"
            name="card-1"
            margin="dense"
            variant="outlined"
            placeholder="ABCD"
            inputRef={register({
              required: true,
            })}
          ></TextField>
        </Row>
        <Row>
          <Typography
            variant="body1"
            style={{ fontWeight: "bold" }}
            component="label"
            htmlFor="card-2"
          >
            Card #2
          </Typography>
          <TextField
            fullWidth
            id="card-1"
            name="card-1"
            margin="dense"
            variant="outlined"
            placeholder="ABCD"
            inputRef={register({
              required: true,
            })}
          ></TextField>
        </Row>
        <Row>
          <Typography
            variant="body1"
            style={{ fontWeight: "bold" }}
            component="label"
            htmlFor="card-3"
          >
            Card #3
          </Typography>
          <TextField
            fullWidth
            id="card-1"
            name="card-1"
            margin="dense"
            variant="outlined"
            placeholder="ABCD"
            inputRef={register({
              required: true,
            })}
          ></TextField>
        </Row>
        <Flex flex="1 1 0%"></Flex>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          type="submit"
          disabled={!isValid}
        >
          Ready!
        </Button>
      </Form>
    </Flex>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
`;

const Row = styled(Flex)`
  flex-direction: column;
  margin-bottom: ${theme.spacing(2)}px;
`;
