import React from "react";
import { Link as RouterLink, useNavigate  } from "react-router-dom";
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
import Swal from 'sweetalert2';
export const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      // Llama a la función del servicio para iniciar sesión
      const response = await apiAuth.signIn({
        email: formData.get('email'),
        password: formData.get('password'),
      });

      if (response.statusCode === 200) {
        // Inicio de sesión exitoso, redirige a la página deseada
        localStorage.setItem('token', response.token);
        // Muestra una alerta exitosa con SweetAlert2
        Swal.fire({
          icon: 'success',
          title: '¡Login Exitoso!',
          text: 'Has iniciado sesión correctamente',
        }).then(() => {
          // Después de hacer clic en OK, redirige a la página deseada
          navigate('/home');
        });
      } else if (response.statusCode === 404) {
        // Usuario no encontrado en la base de datos, muestra alerta correspondiente
        Swal.fire({
          icon: 'error',
          title: 'Usuario no encontrado',
          text: 'El usuario no está registrado en la base de datos',
        });
      } else if (response.statusCode === 401) {
        // Usuario y/o contraseña inválidos, muestra alerta correspondiente
        Swal.fire({
          icon: 'error',
          title: 'Credenciales inválidas',
          text: 'Usuario y/o contraseña inválidos',
        });
      } else {
        // Otro error, muestra alerta genérica
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error durante el inicio de sesión',
        });
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      // Maneja el error de inicio de sesión aquí
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
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link component={RouterLink} to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
