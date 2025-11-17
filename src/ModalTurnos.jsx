import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import api from "./api";

export default function ModalTurnos({ open, onClose, empresa, fechaSeleccionada }) {
  const [horarios, setHorarios] = useState({});
  const [diaSeleccionado, setDiaSeleccionado] = useState("");
  const [turnosDelDia, setTurnosDelDia] = useState([]);
  const [ocupados, setOcupados] = useState([]);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const feriados = [
    "2025-01-01","2025-02-12","2025-03-24","2025-04-18","2025-05-01",
    "2025-05-25","2025-06-20","2025-07-09","2025-12-25"
  ];

  const obtenerNombreDia = (fechaISO) => {
    const dias = [
      "Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"
    ];
    const [a, m, d] = fechaISO.split("-").map(Number);
    const fechaLocal = new Date(a, m - 1, d);
    return dias[fechaLocal.getDay()];
  };

  useEffect(() => {
    if (empresa && open) {
      api.get(`/api/empresas/horarios/${empresa.id}`)
        .then(res => {
          setHorarios(res.data);
          if (fechaSeleccionada) {
            setDiaSeleccionado(obtenerNombreDia(fechaSeleccionada));
          }
        })
        .catch(err => console.error("Error cargando horarios:", err));
    }
  }, [empresa, open, fechaSeleccionada]);

  const generarTurnos = (rango) => {
    const [inicio, fin] = rango.split("-");
    const turnos = [];
    let [hInicio, mInicio] = inicio.split(":").map(Number);
    const [hFin, mFin] = fin.split(":").map(Number);

    while (hInicio < hFin || (hInicio === hFin && mInicio < mFin)) {
      turnos.push(`${String(hInicio).padStart(2,"0")}:${String(mInicio).padStart(2,"0")}`);
      mInicio += 30;
      if (mInicio >= 60) { hInicio++; mInicio = 0; }
    }
    return turnos;
  };

  const cargarOcupados = async () => {
    try {
      const res = await api.get(
        `/api/turnos/ocupados?empresa_id=${empresa.id}&fecha=${fechaSeleccionada}`
      );
      setOcupados(res.data.map(t => t.hora));
    } catch (e) {
      console.error("Error cargando ocupados:", e);
    }
  };

  useEffect(() => {
    if (open && empresa?.id && fechaSeleccionada) {
      cargarOcupados();
    }
  }, [open, empresa?.id, fechaSeleccionada]);

  useEffect(() => {
    if (!diaSeleccionado) return;

    if (feriados.includes(fechaSeleccionada)) {
      setTurnosDelDia([]);
      return;
    }

    if (diaSeleccionado === "Domingo") {
      setTurnosDelDia([]);
      return;
    }

    let rangos = horarios[diaSeleccionado] || [];

    if (diaSeleccionado === "Sábado" && rangos.length > 0) {
      rangos = [rangos[0]];
    }

    let todos = [];
    rangos.forEach((r) => (todos = [...todos, ...generarTurnos(r)]));

    const hoyISO = new Date().toISOString().split("T")[0];

    if (fechaSeleccionada === hoyISO) {
      const horaActual = new Date().toTimeString().slice(0, 5);
      todos = todos.filter(hora => hora > horaActual);
    }

    setTurnosDelDia(todos);
  }, [diaSeleccionado, horarios, fechaSeleccionada]);

  const handleSelectTurno = (hora) => {
    if (ocupados.includes(hora)) return;
    setTurnoSeleccionado(hora);
    setOpenConfirm(true);
  };

  const confirmarReserva = async () => {
    try {
      await api.post("/api/turnos/reservar", {
        empresa_id: empresa.id,
        fecha: fechaSeleccionada,
        hora: turnoSeleccionado,
      });
      setOpenConfirm(false);
      cargarOcupados();
    } catch (err) {
      console.error("Error al reservar:", err);
      alert("❌ No se pudo reservar el turno.");
    }
  };

  if (!empresa) return null;

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.3 }}
              style={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <Box sx={{ width: 550, bgcolor: "#fff", boxShadow: 3, p: 4, borderRadius: 4, textAlign: "center" }}>
                <Typography variant="h5" sx={{ mb: 3, color: "#4A148C" }}>
                  Turnos disponibles - {empresa.nombre}
                </Typography>

                {turnosDelDia.length === 0 && (
                  <Typography color="error" sx={{ mb: 2 }}>
                    No hay turnos disponibles para este día.
                  </Typography>
                )}

                <Grid container spacing={2}>
                  {turnosDelDia.map((hora) => {
                    const ocupado = ocupados.includes(hora);
                    return (
                      <Grid item xs={4} key={hora}>
                        <Card
                          onClick={() => handleSelectTurno(hora)}
                          sx={{
                            p: 2, borderRadius: 2,
                            bgcolor: ocupado ? "#ffebee" : "#e8f5e9",
                            cursor: ocupado ? "not-allowed" : "pointer",
                            opacity: ocupado ? 0.6 : 1
                          }}
                        >
                          <Typography fontWeight="bold">{hora}</Typography>
                          <Typography color={ocupado ? "error" : "success"}>
                            {ocupado ? "Ocupado" : "Libre"}
                          </Typography>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>

                <Box mt={4}>
                  <Button variant="contained" onClick={onClose}>Cerrar</Button>
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirmar reserva</DialogTitle>
        <DialogContent>
          <Typography>¿Desea reservar el turno <b>{turnoSeleccionado}</b>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancelar</Button>
          <Button variant="contained" onClick={confirmarReserva}>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
