import { Box, Button, Typography } from "@mui/material";

import React from "react";
import { useNavigate } from "react-router-dom";
function NotFound() {
  const navigate = useNavigate();
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography variant="h5">
          Oops ! You don't have any existing rooms.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/login")}
          sx={{ mt: 2 }}
        >
          LogIn
        </Button>
      </Box>
    </>
  );
}

export default NotFound;
