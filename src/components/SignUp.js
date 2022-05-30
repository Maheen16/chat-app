import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import * as yup from "yup";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";

export default function SignUp({ snackBarOpen }) {
  const navigate = useNavigate();

  // validation of textField by yup library
  let validationSchema = yup.object({
    username: yup.string().required("cannot be empty"),
  });

  // API calling with 422 error handling
  const signUp = (values) => {
    if (values.username) {
      axios
        .post("http://192.168.1.89:8000/user/signup", {
          username: values.username,
        })
        .then((res) => {
          console.log(res.data);
          navigate("/login");
        })
        .catch((err) => {
          if (err.response.status === 422) {
            snackBarOpen(err.response.data.validation_error.message);
          }
        });
    }
  };

  // formik setup
  const formik = useFormik({
    initialValues: {
      username: "",
    },
    onSubmit: signUp,
    validationSchema,
  });

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
          <form onSubmit={formik.handleSubmit}>
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
                name="username"
                variant="outlined"
                label="Username"
                fullWidth
                error={Boolean(formik.errors.username)}
                helperText={
                  formik.errors.username ? formik.errors.username : ""
                }
                {...formik.getFieldProps("username")}
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
