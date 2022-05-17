import { useState, useRef, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import "../App.css";
import { Box, Paper, InputBase, IconButton } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
export default function Chat() {
  //---- states
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [visible, setVisible] = useState(false);

  // --- hooks
  const bottom = useRef(null);
  const chatBody = useRef(null);
  const params = useParams();
  const navigate = useNavigate();
  // console.log(params);

  // ---- arrow visibility set ----
  const toggleVisible = (e) => {
    const scrolled = chatBody.current?.scrollTop; //500
    const maxScrolled = e.target.scrollHeight;
    let isMax = maxScrolled - scrolled <= 316;
    // console.log(isMax);
    setVisible(!isMax);
  };

  // ---- to set the scroll to bottom ----
  const scrollToBottom = () => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  useEffect(() => {
    let isUserId = window.localStorage.getItem("userId");
    let isRoomId = window.localStorage.getItem("room_Id");
    console.log(isUserId, isRoomId);
    if (isUserId && isRoomId) {
      fetchMessage();
    } else {
      navigate("/login");
    }
  }, []);

  window.addEventListener("scroll", () => console.log("scrolled"));

  //  ---- stack of messsage on screen ----
  const sendMessage = () => {
    if (currentMessage !== "") {
      axios
        .post("http://192.168.1.89:8000/message/save", {
          message: currentMessage,
          room_Id: params.roomId,
          userId: params.userId,
        })
        .then(() => {
          fetchMessage();
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setCurrentMessage("");
  };
  const fetchMessage = () => {
    axios
      .get(`http://192.168.1.89:8000/message/${params.roomId}`)
      .then((response) => {
        if (response.data.length) {
          setMessageList(response.data);
          // console.log(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // let userName = localStorage.getItem("username");
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box>
        <AppBar className="nav">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Toolbar>
              <Typography variant="h4" component="div">
                ChatApp
              </Typography>
            </Toolbar>
          </Box>
        </AppBar>
      </Box>
      <Box
        className="chat-window"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          mt: 10,
        }}
      >
        <Paper
          elevation={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "400px",
            width: "33%",
          }}
        >
          <Box className="chat-header">
            <h4>Live Chat</h4>
          </Box>
          <Box
            className="chat-body message-container"
            ref={chatBody}
            onScroll={toggleVisible}
          >
            {messageList.map((messageContent, index) => {
              return (
                <Box
                  key={index}
                  className="message"
                  id={messageContent.userId === params.userId ? "you" : "other"}
                >
                  <Box>
                    <Box className="message-content">
                      <p>{messageContent.message}</p>
                    </Box>
                    {/* <Box className="message-meta">
                      <p id="author">{userName}</p>
                    </Box> */}
                  </Box>
                </Box>
              );
            })}
            <div ref={bottom} />
            <IconButton
              onClick={scrollToBottom}
              sx={{ display: visible ? "block" : "none" }}
            >
              <ArrowDownwardIcon />
            </IconButton>
          </Box>
          <Box className="chat-footer">
            <Paper
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: 400,
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                value={currentMessage}
                placeholder="Hey..."
                onChange={(event) => {
                  setCurrentMessage(event.target.value);
                }}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
            </Paper>
            <SendIcon onClick={sendMessage} className="send-button" />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
