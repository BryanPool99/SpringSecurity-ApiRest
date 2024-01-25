import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import apiAuth from "../../service/apiAuth";
import Swal from "sweetalert2";

export const Register = () => {
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      // Llama a la función del servicio para registrar
      const response = await apiAuth.signUp({
        name: formData.get("firstName"),
        lastname: formData.get("lastName"),
        email: formData.get("email"),
        password: formData.get("password"),
        role: 'USER',
      });

      if (response.statusCode === 200) {
        // Registro exitoso, muestra alerta exitosa y redirige a la página de inicio de sesión
        Swal.fire({
          icon: "success",
          title: "¡Registro Exitoso!",
          text: "Usuario registrado correctamente. Ahora puedes iniciar sesión.",
        }).then(() => {
          navigate("/login");
        });
      } else if (response.statusCode === 400) {
        // Campos incompletos, muestra alerta correspondiente
        Swal.fire({
          icon: "error",
          title: "Campos Incompletos",
          text: "Completa todos los campos requeridos.",
        });
      } else if (response.statusCode === 409) {
        // Usuario ya registrado, muestra alerta correspondiente
        Swal.fire({
          icon: "error",
          title: "Usuario Existente",
          text: "El correo electrónico ya está registrado.Se le rederigira al Login",
        }).then(() => {
          navigate("/login");
        });
      } else {
        // Otro error, muestra alerta genérica
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error durante el registro.",
        });
      }
    } catch (error) {
      console.error("Error durante el registro:", error);
      // Maneja el error de registro aquí
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Registro de Usuario
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
