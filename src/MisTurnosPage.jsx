import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, Button } from "@mui/material";
import { motion } from "framer-motion";
import api from "./api";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

export default function MisTurnosPage() {
  const [turnos, setTurnos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/turnos/mis-turnos") // ⬅ Ya no ponemos /api
      .then((res) => setTurnos(res.data))
      .catch((err) => console.error("Error cargando mis turnos:", err));
  }, []);

  const cancelarTurno = async (turnoId) => {
    if (!window.confirm("¿Seguro que deseas cancelar este turno?")) return;

    try {
      await api.delete(`/turnos/cancelar/${turnoId}`); // ⬅ Sin /api

      setTurnos((prev) => prev.filter((t) => t.id !== turnoId));
      alert("Turno cancelado correctamente");
    } catch (err) {
      console.error("Error cancelando turno:", err);
      alert("❌ No se pudo cancelar el turno.");
    }
  };

  return (
    <Box
      sx={{
        maxHeight: "100vh",
        background: "linear-gradient(180deg, #EDE7F6 0%, #ffffff 100%)",
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          variant="h4"
          sx={{ mb: 3, textAlign: "center", fontWeight: "bold", color: "#4A148C" }}
        >
          📅 Mis Turnos
        </Typography>
      </motion.div>

      {turnos.length === 0 && (
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            p: 4,
            borderRadius: 4,
            boxShadow: 6,
            textAlign: "center",
            maxWidth: 450,
          }}
        >
          <EventBusyIcon sx={{ fontSize: 70, color: "#7E57C2" }} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            No tienes turnos reservados
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Agenda uno para no perder tu lugar 😉
          </Typography>

          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/")}
            sx={{ backgroundColor: "#7E57C2" }}
          >
            Volver al Inicio
          </Button>
        </Paper>
      )}

      <Grid container spacing={2} justifyContent="center" sx={{ width: "100%", maxWidth: 1200 }}>
        {turnos.map((turno) => {
          const fecha = new Date(turno.fecha);
          const fechaFormateada = fecha.toLocaleDateString("es-AR", {
            weekday: "long",
            month: "long",
            day: "numeric",
          });

          return (
            <Grid item xs={12} sm={6} md={4} key={turno.id}>
              <Paper
                component={motion.div}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.35 }}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  boxShadow: 6,
                  textAlign: "center",
                  borderTop: "6px solid #7E57C2",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#4A148C" }}>
                  {turno.empresa_nombre || "Sin empresa"}
                </Typography>

                <Typography sx={{ mt: 1 }}>
                  📆 {fechaFormateada}
                </Typography>

                <Typography sx={{ fontSize: "1.1rem", fontWeight: "bold", mt: 1 }}>
                  🕒 {turno.hora.slice(0, 5)} hs
                </Typography>

                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => cancelarTurno(turno.id)}
                  sx={{ mt: 2 }}
                >
                  Cancelar Turno
                </Button>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
