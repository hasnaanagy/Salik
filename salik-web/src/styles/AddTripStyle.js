export const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            borderColor: "rgba(0, 0, 0, 0.23)",
        },
        "&:hover fieldset": {
            borderColor: "rgba(0, 0, 0, 0.87)",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#ffb800",
        },
    },
    "& .MuiInputLabel-root": {
        color: "rgba(0, 0, 0, 0.54)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: "#ffb800",
    },
};

export const buttonStyles = {
    marginTop: "20px",
    backgroundColor: "#ffb800",
    color: "black",
    "&:hover": {
        backgroundColor: "#e6a700",
    },
};

export const containerStyles = {
    padding: "50px",
    marginBottom: "50px",
};