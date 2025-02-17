import styled from "styled-components";
import { OutlinedInput, InputLabel } from "@mui/material";

const primaryColor = "#FFB800";
const textColor = "#444";
const placeholderColor = "#888";
const borderRadius = "12px";

const StyledOutlinedInput = styled(OutlinedInput)`
  border-radius: ${borderRadius} !important;
  background-color: transparent !important;

  &.MuiInputBase-root,
  &.MuiOutlinedInput-root {
    background-color: transparent !important;
  }

  & .MuiOutlinedInput-notchedOutline {
    border-color: ${placeholderColor} !important;
    border-radius: ${borderRadius} !important;
    transition: border-color 0.3s ease-in-out, border-radius 0.3s ease-in-out;
  }

  &:hover .MuiOutlinedInput-notchedOutline {
    border-color: ${primaryColor} !important;
  }

  &.Mui-focused {
    background-color: transparent !important;
  }

  &.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: ${primaryColor} !important;
    border-width: 2px !important;
    border-radius: ${borderRadius} !important;
  }

  & input {
    // color: ${textColor} !important;
    background-color: transparent !important;
  }

  & input::placeholder {
    color: ${placeholderColor} !important;
    opacity: 1;
  }

 
`;

const StyledInputLabel = styled(InputLabel)`
  color: ${placeholderColor} !important;

  &.Mui-focused {
    color: ${primaryColor} !important;
  }
`;

export { StyledOutlinedInput, StyledInputLabel };
