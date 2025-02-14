import styled from "styled-components";
import { OutlinedInput, InputLabel, Button } from '@mui/material';

// Styled Input
export const StyledOutlinedInput = styled(OutlinedInput)`
  
`;

export const StyledInputLabel = styled(InputLabel)`

`;

export const SubmitButton = styled(Button)`
  background-color: #FFB800;
  color: black;
  font-weight: bold;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  width: 100%;
  height: 40px;
  line-height: 40px;

  &:hover {
    background-color: #FFB800;
  }
`;
