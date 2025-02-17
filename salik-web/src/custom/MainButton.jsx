import styled from "styled-components";
import { Button } from '@mui/material';

export const MainButton = styled(Button)`
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
