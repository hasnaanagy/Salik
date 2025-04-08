export const containerStyles = {
    padding: "50px",
};

export const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "rgba(0, 0, 0, 0.23)" },
        "&:hover fieldset": { borderColor: "rgba(0, 0, 0, 0.87)" },
        "&.Mui-focused fieldset": { borderColor: "#ffb800" },
    },
    "& .MuiInputLabel-root": { color: "rgba(0, 0, 0, 0.54)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#ffb800" },
};

export const mechanicTypeStyles = {
    "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "rgba(0, 0, 0, 0.23)" },
        "&:hover fieldset": { borderColor: "rgba(0, 0, 0, 0.87)" },
        "&.Mui-focused fieldset": { borderColor: "#ffb800" },
        "&.Mui-disabled": {
            backgroundColor: "#f5f5f5",
            color: "rgba(0, 0, 0, 0.87)",
            WebkitTextFillColor: "rgba(0, 0, 0, 0.87)",
        },
    },
    "& .MuiInputLabel-root": { color: "rgba(0, 0, 0, 0.54)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#ffb800" },
    "& .MuiInputLabel-root.Mui-disabled": { color: "rgba(0, 0, 0, 0.54)" },
};

export const timeFieldStyles = {
    "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "rgba(0, 0, 0, 0.23)" },
        "&:hover fieldset": { borderColor: "rgba(0, 0, 0, 0.87)" },
        "&.Mui-focused fieldset": { borderColor: "#ffb800" },
    },
    "& .MuiInputLabel-root": { color: "rgba(0, 0, 0, 0.54)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#ffb800" },
};

export const buttonStyles = {
    marginTop: "20px",
    backgroundColor: "#ffb800",
    color: "black",
};