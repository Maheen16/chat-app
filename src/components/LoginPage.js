import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage({ snackBarOpen }) {
  //---- states ----
  const [user, setUser] = useState("");
  const [roomId, setRoomId] = useState("");
  const [errorName, setErrorName] = useState(false);
  const [errorId, setErrorId] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  //---- hooks ----
  const navigate = useNavigate();

  // ---- username change ----
  const handleNameChange = (e) => {
    setUser(e.target.value);
    if (e.target.value === "") {
      setErrorName(true);
    } else {
      setErrorName(false);
    }
  };

  // ---- room id change ----
  const handleIdChange = (e) => {
    let error = false;
    let errorMessage = "";
    let alphaExp = /^[a-zA-Z]+$/;
    setRoomId(e.target.value);
    if (e.target.value === "") {
      error = true;
      errorMessage = "room id is required";
    } else {
      if (!alphaExp.test(e.target.value)) {
        errorMessage = "number is not valid";
        error = true;
        // console.log("number is not valid");
      } else {
        if (e.target.value.length !== 4) {
          error = true;
          errorMessage = "only 4 characters";
        } else {
          error = false;
          errorMessage = "";
        }
      }
    }
    setErrorId(error);
    setErrorMsg(errorMessage);
  };

  //---- login with validations ----
  const logIn = (e) => {
    e.preventDefault();
    let flag = false;
    let alphaExp = /^[a-zA-Z]+$/;

    if (user === "") {
      setErrorName(true);
      flag = true;
    }
    if (roomId === "") {
      setErrorMsg("room id is required");
      setErrorId(true);
      flag = true;
    } else {
      if (!alphaExp.test(roomId)) {
        flag = true;
        // console.log(roomId, "number is not valid");
      }
      if (roomId.length !== 4) {
        flag = true;
      }
    }
    if (!flag) {
      setIsLoading(true);
      axios
        .post("http://192.168.1.89:8000/user/login", {
          username: user,
          roomId,
        })
        .then((res) => {
          console.log(res.data);
          setIsLoading(false);
          navigate(`/chat/${res.data.room_Id}/${res.data.userId}`);
        })
        .catch((err) => {
          if (err.response.status === 500) {
            snackBarOpen("Internal Server Error");
          } else if (err.response.status === 422) {
            snackBarOpen("you have not signed up.please sign up");
          } else {
            snackBarOpen("");
          }
          setIsLoading(false);
          console.log(err);
        });
      // console.log("redirect");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={2}
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 4,
          width: "30%",
          height: "470px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            textAlign: "center",
          }}
        >
          <Typography variant="h3" sx={{ mb: 1 }} color="primary">
            ChatApp
          </Typography>
          <Typography variant="body1">Sign In</Typography>
          <Typography variant="body1">Fill Below Information</Typography>
          <form onSubmit={logIn}>
            <TextField
              fullWidth
              value={user}
              id="standard-basic"
              label="Username"
              size="small"
              variant="outlined"
              error={errorName}
              helperText={errorName && "username is required"}
              placeholder="Michel Jackson"
              sx={{ my: 2 }}
              onChange={handleNameChange}
            />
            <TextField
              fullWidth
              value={roomId}
              error={errorId}
              id="standard-basic"
              label="Room Id"
              helperText={errorMsg}
              variant="outlined"
              size="small"
              placeholder="room id"
              sx={{ mb: 2 }}
              onChange={handleIdChange}
            />
            <Typography variant="body1" sx={{ my: 2 }}>
              Start chatting by clicking on :) below button and have fun !
            </Typography>
            <Button
              fullWidth
              disabled={isLoading}
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              type="submit"
            >
              {isLoading ? <CircularProgress /> : "LogIn"}
            </Button>
          </form>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              pt: 3,
            }}
          >
            <Typography>Don't have an account ?</Typography>
            <Link to="/" style={{ textDecoration: "none" }}>
              <Button>Sign up</Button>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
