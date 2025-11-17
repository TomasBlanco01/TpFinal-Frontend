import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper
} from "@mui/material";
import { motion } from "framer-motion";
import api from "./api";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", {
        nombre,
        email,
        contraseña,
      });

      navigate("/auth/login");
    } catch (err) {
      console.error(err);

      const mensaje =
        err.response?.data?.message ||
        "Error al registrar el usuario. Verifica los datos.";

      setError(mensaje);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
        background: "linear-gradient(180deg, #f3e7ff 0%, #ffffff 100%)",
      }}
    >
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{
          p: 4,
          width: 400,
          borderRadius: 4,
          boxShadow: 6,
        }}
      >
        <Typography
          variant="h4"
          sx={{ mb: 3, fontWeight: "bold", color: "#4A148C", textAlign: "center" }}
        >
          Crear Cuenta
        </Typography>

        <TextField
          label="Nombre"
          fullWidth
          sx={{ mb: 2 }}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <TextField
          label="Correo electrónico"
          fullWidth
          sx={{ mb: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          sx={{ mb: 2 }}
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
        />

        {error && (
          <Typography color="error" sx={{ mb: 1, textAlign: "center" }}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            bgcolor: "#7E57C2",
            "&:hover": { bgcolor: "#5E35B1" },
          }}
          onClick={handleRegister}
        >
          Registrarse
        </Button>

        <Typography sx={{ mt: 2, textAlign: "center" }}>
          ¿Ya tienes cuenta?{" "}
          <Link to="/auth/login" style={{ color: "#6a1b9a", fontWeight: "bold" }}>
            Inicia sesión
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
