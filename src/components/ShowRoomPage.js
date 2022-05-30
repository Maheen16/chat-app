import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import NotFound from "../Pages/NotFound";
function ShowRoomPage() {
  // ----- states -----
  const [rooms, setRooms] = useState([]);
  // ----hooks ----
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `http://192.168.1.89:8000/user/getAllRoomsByUserName/${localStorage.getItem(
          "username"
        )}`
      )
      .then((res) => {
        // room Ids logic goes here...
        if (res.status) {
          let { all_roomsId, _id } = res.data.data;
          localStorage.setItem("userId", _id);
          // console.log(_id);
          setRooms(all_roomsId);
        }
      })
      .catch((err) => {
        // console.log(err);
      });
  }, []);

  // navigating to particular chat
  const goToChat = (roomId) => {
    // console.log("clicked", roomId);
    localStorage.setItem("room_Id", roomId);
    navigate(
      `/chat/${localStorage.getItem("room_Id")}/${localStorage.getItem(
        "userId"
      )}`
    );
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton aria-label="go back" onClick={() => navigate("/login")}>
              <ArrowBackIcon color="primary" />
            </IconButton>
            <Typography
              variant="h3"
              sx={{ mb: 1, width: "100%", textAlign: "center" }}
              color="primary"
            >
              ChatApp
            </Typography>
          </Box>
          <Typography variant="body1" color="primary">
            Your Room Ids
          </Typography>
          <Box
            sx={{
              height: "450px",
              overflowY: "auto",
              borderRadius: "12px",
              mt: 2,
            }}
          >
            {rooms.length === 0 ? (
              <NotFound />
            ) : (
              <List>
                {rooms.map((curElm, index) => {
                  return (
                    <Box key={curElm.RoomId}>
                      <ListItemButton onClick={() => goToChat(curElm.RoomId)}>
                        <ListItemText
                          sx={{ fontWeight: "bold" }}
                          primary={curElm.room}
                        />
                      </ListItemButton>
                      <Divider />
                    </Box>
                  );
                })}
              </List>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default ShowRoomPage;
