import axios from "axios";
import React, { useState } from "react";
import Chat from "./Chat";
import LoginPage from "./LoginPage";
import SignUp from "./SignUp";
export default function MainPage() {
  // const [userName, setUserName] = useState("");
  // const [roomId, setRoomId] = useState("");
  // const [errorName, setErrorName] = useState(false);
  // const [errorId, setErrorId] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  // const [errorMsg, setErrorMsg] = useState("");
  // const [isRoomExist, setIsRoomExist] = useState(false);

  // ---- username change ----
  // const handleNameChange = (e) => {
  //   setUserName(e.target.value);
  //   if (e.target.value === "") {
  //     setErrorName(true);
  //   } else {
  //     setErrorName(false);
  //   }
  // };

  // // ---- room id change ----
  // const handleIdChange = (e) => {
  //   let error = false;
  //   let errorMessage = "";
  //   let alphaExp = /^[a-zA-Z]+$/;
  //   setRoomId(e.target.value);
  //   if (e.target.value === "") {
  //     error = true;
  //     errorMessage = "room id is required";
  //   } else {
  //     if (!alphaExp.test(e.target.value)) {
  //       errorMessage = "number is not valid";
  //       error = true;
  //       // console.log("number is not valid");
  //     } else {
  //       if (e.target.value.length !== 4) {
  //         error = true;
  //         errorMessage = "only 4 characters";
  //       } else {
  //         error = false;
  //         errorMessage = "";
  //       }
  //     }
  //   }
  //   setErrorId(error);
  //   setErrorMsg(errorMessage);
  // };

  // ---- on click of login ----
  const logIn = () => {
    let flag = false;
    let alphaExp = /^[a-zA-Z]+$/;

    if (userName === "") {
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
        .post("http://192.168.1.89:8000/user", {
          username: userName,
          roomId,
        })
        .then((res) => {
          setIsLoading(false);
          setIsLoggedIn(true);
          if (res.data.RoomExist) {
            setIsRoomExist(true);
          }
          // console.log(res.data);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
        });
      console.log("redirect");
    }
  };

  // ---- taking back to the login page ----
  const goBack = () => {
    setUserName("");
    setRoomId("");
    setIsLoggedIn(false);
  };
  return (
    <>
      {isLoggedIn ? (
        <Chat
          goBack={goBack}
          roomId={roomId}
          userName={userName}
          isRoomExist={isRoomExist}
        />
      ) : (
        <>
          <LoginPage
            handleNameChange={handleNameChange}
            logIn={logIn}
            userName={userName}
            roomId={roomId}
            handleIdChange={handleIdChange}
            errorName={errorName}
            errorId={errorId}
            errorMsg={errorMsg}
            isLoading={isLoading}
          />
        </>
      )}
    </>
  );
}
