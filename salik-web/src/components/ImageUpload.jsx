import React, { useEffect } from "react";
import { Box, Typography, Snackbar } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useState } from "react";

const ImageUpload = ({ type, label, setImage }) => {
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/jpeg": [".jpeg", ".jpg"], "image/png": [".png"] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (!file) {
        setError("No file selected.");
        return;
      }

      const validExtensions = ["jpg", "jpeg", "png"];
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const validMimeTypes = ["image/jpeg", "image/png"];

      if (
        !validExtensions.includes(fileExtension) ||
        !validMimeTypes.includes(file.type)
      ) {
        setError("Invalid file type. Please upload an image (JPG, PNG, JPEG).");
        return;
      }

      if (setImage && typeof setImage === "function") {
        setImage(file); // ✅ Set image in parent state
      } else {
        console.error(`setImage is not a function for ${type}`);
      }

      setPreview(URL.createObjectURL(file)); // ✅ Show preview
      setError(null);
    },
  });

  return (
    <>
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed gray",
          padding: 6,
          textAlign: "center",
          bgcolor: "#f5f5f5",
          borderRadius: 8,
        }}
      >
        <input {...getInputProps()} />
        {preview ? (
          <img
            src={preview}
            alt={label}
            width="100%"
            style={{ borderRadius: 8 }}
          />
        ) : (
          <Typography color="gray">Drop your image here</Typography>
        )}
      </Box>
      {error && (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          message={error}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
      )}
    </>
  );
};

export default ImageUpload;
