const CardStyles = {
    container: {
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        mb: 2,
        width: "100%",
        maxWidth: "100%",
        animation: "fadeIn 0.5s ease-in",
        "@keyframes fadeIn": {
            from: { opacity: 0 },
            to: { opacity: 1 },
        },
        "&:hover": {
            transform: { xs: "none", sm: "scale(1.02)" },
            transition: "transform 0.3s ease-in-out",
        },
    },
    statusDot: {
        width: { xs: 12, sm: 14 },
        height: { xs: 10, sm: 14 },
        borderRadius: "50%",
        flexShrink: 0,
        mr: { xs: 1, sm: 1.5 },
    },
    pulseAnimation: {
        animation: "pulse 1.5s infinite",
        "@keyframes pulse": {
            "0%": { boxShadow: "0 0 0 0 rgba(255, 184, 0, 0.5)" }, // Default to #FFB800, updated in component
            "70%": { boxShadow: "0 0 0 8px rgba(255, 184, 0, 0)" },
            "100%": { boxShadow: "0 0 0 0 rgba(255, 184, 0, 0)" },
        },
    },
    card: {
        width: "100%",
        maxWidth: { xs: "220px", sm: "400px", md: "500px" },
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        background: "linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)",
        padding: { xs: 1, sm: 1.5 },
        transition: "box-shadow 0.3s ease-in-out",
        "&:hover": {
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
        },
    },
    cardContent: {
        display: "flex",
        alignItems: "center",
        width: "100%",
        gap: { xs: 1, sm: 1.5 },
        padding: { xs: "8px !important", sm: "12px !important" },
    },
    carImage: {
        width: { xs: 36, sm: 48 },
        height: { xs: 36, sm: 48 },
        mr: { xs: 1, sm: 2 },
    },
    rideDetails: {
        flex: 1,
        textAlign: "left",
        minWidth: 0,
    },
    title: {
        fontSize: { xs: "0.9rem", sm: "1rem" },
        fontWeight: 600,
        color: "#333",
        letterSpacing: 0.1,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    dateTime: {
        fontSize: { xs: "0.75rem", sm: "0.85rem" },
        fontWeight: 500,
        my: 0.3,
    },
    details: {
        fontSize: { xs: "0.7rem", sm: "0.8rem" },
        color: "text.secondary",
        lineHeight: 1.3,
    },
    actionButtons: {
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        gap: { xs: 0.5, sm: 1 },
        ml: { xs: 1, sm: 1.5 },
        mr: { xs: 1, sm: 1 },
    },
    cancelButton: {
        background: "linear-gradient(45deg, #FFB800 30%, #FFD54F 90%)",
        color: "#000",
        fontWeight: "bold",
        padding: { xs: "4px 8px", sm: "6px 12px" },
        fontSize: { xs: "0.7rem", sm: "0.8rem" },
        borderRadius: 1,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        "&:hover": {
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        },
        "&:disabled": {
            background: "#e0e0e0",
            color: "#999",
            boxShadow: "none",
        },
    },
    iconButton: {
        padding: { xs: "4px", sm: "6px" },
        transition: "all 0.3s ease",
        "&:hover": {
            transform: "scale(1.1)",
        },
    },
    editButton: {
        color: "#FFB800",
        bgcolor: "rgba(255, 184, 0, 0.1)",
        "&:hover": {
            bgcolor: "rgba(255, 184, 0, 0.3)",
        },
    },
    deleteButton: {
        color: "#F44336",
        bgcolor: "rgba(244, 67, 54, 0.1)",
        "&:hover": {
            bgcolor: "rgba(244, 67, 54, 0.3)",
        },
    },
};

export default CardStyles;