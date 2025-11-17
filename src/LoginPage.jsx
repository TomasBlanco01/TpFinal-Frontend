import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import api from "./api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");

      const res = await api.post("/auth/login", {
        email,
        contraseña,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Credenciales inválidas o error en el servidor");
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
          Iniciar Sesión
        </Typography>

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
          onClick={handleLogin}
        >
          Iniciar Sesión
        </Button>

        <Typography sx={{ mt: 2, textAlign: "center" }}>
          ¿No tienes cuenta?{" "}
          <Link to="/auth/register" style={{ color: "#6a1b9a", fontWeight: "bold" }}>
            Regístrate aquí
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
