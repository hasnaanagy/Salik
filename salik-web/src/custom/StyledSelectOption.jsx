import { styled } from "@mui/material";

const StyledSelect = styled("select")(({ theme }) => ({
  width: "100%",
  padding: "14px",
  marginBottom: "16px",
  borderRadius: "12px",
  border: "1px solid #ccc",
  backgroundColor: "#F3F3F3",
  fontSize: "16px",
  outline: "none",
  appearance: "none", // Remove default arrow icon (cross-browser)
}));

const StyledOption = styled("option")(({ theme }) => ({
  padding: "10px",
  fontSize: "16px",
  backgroundColor: "#F3F3F3",
  color: "#333",
}));

export { StyledSelect, StyledOption };
