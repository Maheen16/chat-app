import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp({ snackBarOpen }) {
  const [username, setUsername] = useState("");
  const [isUserNameValid, setIsUserNameValid] = useState(false);

  const navigate = useNavigate();

  // ---- username setup ----
  const handleUserName = (e) => {
    setUsername(e.target.value);
    if (e.target.value === "") {
      setIsUserNameValid(true);
    } else {
      setIsUserNameValid(false);
    }
  };

  // ---- handling sign up with snackbar ----
  const signUp = (e) => {
    e.preventDefault();
    if (username !== "") {
      axios
        .post("http://192.168.1.89:8000/user/signup", {
          username: username,
        })
        .then((res) => {
          console.log(res.data);
          navigate("/login");
        })
        .catch((err) => {
          if (err.response.status === 422) {
            // console.log(err.response.data.validation_error.message);
            snackBarOpen(err.response.data.validation_error.message);
          }
        });
    } else {
      setIsUserNameValid(true);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        height: "95vh",
      }}
    >
      <Paper sx={{ display: "flex", width: "30%", p: 4 }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <form onSubmit={signUp}>
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold" }}
                color="primary"
              >
                Welcome to ChatApp
              </Typography>
              <Typography sx={{ fontWeight: "bold", pb: 3 }}>
                Create Your Account. It's very easy.
              </Typography>
              <TextField
                error={isUserNameValid}
                helperText={isUserNameValid ? "please enter name" : ""}
                value={username}
                onChange={handleUserName}
                fullWidth
                variant="outlined"
                size="small"
                id="outlined-basic"
                label="Username"
                placeholder="samjohnson"
              />
            </Box>
            <Box>
              <Button variant="contained" fullWidth type="submit">
                SignUp
              </Button>
            </Box>
          </form>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              pt: 3,
            }}
          >
            <Typography>Already having an account?</Typography>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Button type="submit">LogIn</Button>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
