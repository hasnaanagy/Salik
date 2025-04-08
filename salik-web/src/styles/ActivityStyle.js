const ActivityStyles = {
    container: {
        spacing: 2,
        justifyContent: "center",
    },
    gridItem: {
        xs: 12,
        sm: 10,
        md: 8,
        lg: 6,
    },
    noRidesBox: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
        textAlign: "center",
    },
    noRidesText: {
        color: "text.secondary",
        fontWeight: 500,
        fontSize: { xs: "1.25rem", sm: "1.5rem" },
    },
    sectionTitle: {
        marginBottom: 5,
    },
    sectionTitleWithTopMargin: {
        marginBottom: 5,
        marginTop: 5,
    },
    emptySectionText: {
        mb: 2,
        color: "text.secondary",
    },
};

export default ActivityStyles;