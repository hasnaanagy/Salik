import { styled, TextField } from "@mui/material";

export const StyledTextField = styled(TextField)({
  width: "80%",
  "& .MuiInputBase-root": {
    marginBottom: "20px",
    padding: "5px 10px",
    borderRadius: "12px",
    backgroundColor: "#F3F3F3",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #ccc",
  },
  "& .MuiInputBase-input": {
    fontSize: "16px",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    outline: "none",
    border: "1px solid #FFB800",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "2px solid #FFB800",
  },
});
