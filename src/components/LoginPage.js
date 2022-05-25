import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
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
  const [checked, setChecked] = useState(false);
  const [showRoomIdField, setshowRoomIdField] = useState(true);

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

  // controll roomId Field
  const handleChange = (event) => {
    let { checked } = event.target;
    // console.log(event.target.checked);
    setChecked(checked);
    if (checked) {
      setshowRoomIdField(false);
    } else {
      setshowRoomIdField(true);
    }
  };
  // ---- room id handler ----
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

    if (showRoomIdField) {
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
    }
    if (!flag) {
      setIsLoading(true);

      if (!showRoomIdField) {
        setIsLoading(false);
        localStorage.setItem("username", user);
        axios
          .get(`http://192.168.1.89:8000/user/${user}`)
          .then((res) => {
            if (!res.isExist) {
              navigate(`/rooms/${user}`);
            }
            console.log(res.data);
          })
          .catch((err) => {
            const { message } = err.response.data;
            snackBarOpen(message);
            // user exist logic goes here by API
            console.log(err.response.data);
          });
      } else {
        axios
          .post("http://192.168.1.89:8000/user/login", {
            username: user,
            roomId,
          })
          .then((res) => {
            console.log(res.data);
            setIsLoading(false);
            localStorage.setItem("userId", res.data.userId);
            localStorage.setItem("room_Id", res.data.room_Id);
            navigate(`/chat/${res.data.room_Id}/${res.data.userId}`);
          })
          .catch((err) => {
            console.log(err);
            snackBarOpen(err.message);
            if (err.response.status === 500) {
              snackBarOpen("Internal Server Error");
            } else if (err.response.status === 422) {
              snackBarOpen("you have not signed up.please sign up");
            } else {
              snackBarOpen("");
            }
            setIsLoading(false);
          });
      }
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
          height: "500px",
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
          <FormControlLabel
            control={
              <Switch
                checked={checked}
                onChange={handleChange}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              />
            }
            label="login with existing roomIds"
          />
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
            {showRoomIdField && (
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
            )}

            <Typography variant="body1" sx={{ my: 1 }}>
              Start chatting by clicking on :) below button and have fun !
            </Typography>
            <Button
              fullWidth
              disabled={isLoading}
              variant="contained"
              color="primary"
              sx={{ mt: 1 }}
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
