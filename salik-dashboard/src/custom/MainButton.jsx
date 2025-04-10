import { Button } from "@mui/material";
import styled from "styled-components";

export const MainButton = styled(Button).attrs({ variant: "contained" })`
  background-color: #ffb800 !important; /* Ensure it's applied */
  color: black !important;
  font-weight: bold !important;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  width: 40%;
  height: 40px;
  line-height: 40px;
  &:hover {
    background-color: #ffb800;
  }
`;
