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
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as yup from "yup";

export default function LoginPage({ snackBarOpen }) {
  //---- states ----
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const initialValues = { username: "", roomId: "", checked: false };

  // Valiating fields
  let validationSchema = yup.object().shape({
    checked: yup.boolean(),
    username: yup.string().required("cannot be empty"),
    roomId: yup.string().when("checked", {
      is: (checked) => checked !== true,
      then: yup
        .string()
        .length(4, "only 4 characters")
        .required("cannot be empty"),
    }),
  });

  //---- login  ----
  const onSubmit = (values) => {
    console.log(values.checked, "outside if");
    if (values.checked === true) {
      console.log(values.checked, "inside if");
      console.log("values", values);
      setIsLoading(false);
      localStorage.setItem("username", values.username);
      axios
        .get(`http://192.168.1.89:8000/user/${values.username}`)
        .then((res) => {
          console.log(res.data);
          if (!res.isExist) {
            navigate(`/rooms/${values.username}`);
          }
          // console.log(res.data);
        })
        .catch((err) => {
          const { message } = err.response.data;
          snackBarOpen(message);
        });
    } else {
      axios
        .post("http://192.168.1.89:8000/user/login", {
          username: values.username,
          roomId: values.roomId,
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
          <Formik
            initialValues={initialValues}
            onChange={({ nextVal }) => setCurrentValues(nextVal)}
            onSubmit={onSubmit}
            enableReinitialize={true}
            validationSchema={validationSchema}
          >
            {({ values, errors }) => (
              <>
                <Form>
                  <Field
                    as={FormControlLabel}
                    name="checked"
                    control={
                      <Switch
                        checked={values.checked}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      />
                    }
                    label="login with existing roomIds"
                  />
                  <Field
                    as={TextField}
                    name="username"
                    fullWidth
                    id="standard-basic"
                    label="Username"
                    size="small"
                    variant="outlined"
                    sx={{ my: 2 }}
                    error={Boolean(errors.username)}
                    helperText={<ErrorMessage name="username" />}
                    placeholder="Michel Jackson"
                  />
                  {!values.checked && (
                    <Field
                      as={TextField}
                      name="roomId"
                      fullWidth
                      id="standard-basic"
                      label="Room Id"
                      error={Boolean(errors.roomId)}
                      helperText={<ErrorMessage name="roomId" />}
                      variant="outlined"
                      size="small"
                      placeholder="room id"
                      sx={{ mb: 2 }}
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
                </Form>
              </>
            )}
          </Formik>
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
