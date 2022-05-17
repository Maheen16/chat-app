import { IconButton, Snackbar } from "@mui/material";
import { useState } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import "./App.css";
import Chat from "./components/Chat";
import LoginPage from "./components/LoginPage";
import SignUp from "./components/SignUp";
import CloseIcon from "@mui/icons-material/Close";

function App() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleOpen = (message) => {
    setOpen(true);
    setMessage(message);
  };

  const handleClose = () => {
    setOpen(false);
    setMessage("");
  };

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );
  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={message}
        action={action}
      />
      <Routes>
        <Route path="/" element={<SignUp snackBarOpen={handleOpen} />} />
        <Route
          path="/login"
          element={<LoginPage snackBarOpen={handleOpen} />}
        />
        {/* <Route path="/chat/:roomId/:userId" element={<Chat />} /> */}
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
