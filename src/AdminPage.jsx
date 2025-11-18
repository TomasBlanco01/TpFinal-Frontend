import React, { useEffect, useState } from "react";
import {
  Box, Typography, TextField, Button, Grid, Paper, List, ListItem, ListItemButton,
  ListItemText, Divider
} from "@mui/material";
import { motion } from "framer-motion";
import api from "./api";

export default function AdminPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id: "",
    nombre: "",
    direccion: "",
    telefono: "",
    slogan: "",
    duracion_turno_min: "",
    categoria_id: "",
    admin_id: user?.id ?? null,
  });

  // ---------------------------
  // Cargar todas las empresas
  // ---------------------------
  const fetchEmpresas = async () => {
    try {
      const res = await api.get("/empresas");
      setEmpresas(res.data ?? []);
    } catch (err) {
      console.error(err);
      alert("Error al cargar empresas");
    }
  };

  // ---------------------------
  // Cargar empresa individual
  // ---------------------------
  const fetchEmpresa = async (id) => {
    try {
      const res = await api.get(`/empresas/${id}`);
      const data = res.data;

      setForm({
        id: data.id,
        nombre: data.nombre ?? "",
        direccion: data.direccion ?? "",
        telefono: data.telefono ?? "",
        slogan: data.slogan ?? "",
        duracion_turno_min: data.duracion_turno_min ?? "",
        categoria_id: data.categoria_id ?? "",
        admin_id: data.admin_id ?? user?.id ?? null,
      });
    } catch (err) {
      console.error(err);
      alert("Error al obtener la empresa");
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  // ---------------------------
  // Manejo de formulario
  // ---------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: name === "duracion_turno_min" ? Number(value) : value,
    }));
  };

  // ---------------------------
  // Guardar o actualizar empresa
  // ---------------------------
  const handleSave = async () => {
    try {
      setLoading(true);

      if (form.id) {
        await api.put(`/empresas/${form.id}`, form);
        alert("Empresa actualizada");
      } else {
        const res = await api.post("/empresas", form);
        alert("Empresa creada");
        fetchEmpresa(res.data.id);
      }

      fetchEmpresas();
    } catch (err) {
      console.error(err);
      alert("Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Eliminar empresa
  // ---------------------------
  const handleDelete = async () => {
    if (!form.id) return;

    if (!window.confirm("¿Eliminar esta empresa?")) return;

    try {
      setLoading(true);
      await api.delete(`/empresas/${form.id}`);
      alert("Empresa eliminada");
      setForm({
        id: "",
        nombre: "",
        direccion: "",
        telefono: "",
        slogan: "",
        duracion_turno_min: "",
        categoria_id: "",
        admin_id: user?.id ?? null,
      });
      fetchEmpresas();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Nueva empresa
  // ---------------------------
  const createNew = () => {
    setForm({
      id: "",
      nombre: "",
      direccion: "",
      telefono: "",
      slogan: "",
      duracion_turno_min: "",
      categoria_id: "",
      admin_id: user?.id ?? null,
    });
  };

  return (
    <Box sx={{ display: "flex", height: "100%", p: 4, gap: 4 }}>
      {/* ---------- COLUMNA IZQUIERDA: FORM ---------- */}
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ flex: 1, p: 4, borderRadius: 4 }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          {form.id ? "Editar Empresa" : "Crear Empresa"}
        </Typography>

        <Grid container spacing={2}>
          {Object.entries(form)
            .filter(([k]) => k !== "id" && k !== "admin_id")
            .map(([key, value]) => (
              <Grid item xs={12} key={key}>
                <TextField
                  fullWidth
                  label={key.replace(/_/g, " ").toUpperCase()}
                  name={key}
                  value={value ?? ""}
                  onChange={handleChange}
                  type={key === "duracion_turno_min" ? "number" : "text"}
                />
              </Grid>
            ))}
        </Grid>

        <Box mt={3} display="flex" gap={2}>
          <Button variant="contained" onClick={handleSave} disabled={loading}>
            {form.id ? "Guardar Cambios" : "Crear Empresa"}
          </Button>

          {form.id && (
            <Button color="error" variant="outlined" onClick={handleDelete}>
              Eliminar
            </Button>
          )}
        </Box>
      </Paper>

      {/* ---------- COLUMNA DERECHA: LISTA DE EMPRESAS ---------- */}
      <Paper sx={{ width: 350, borderRadius: 4, p: 2, height: "75vh", overflow: "auto" }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Empresas
        </Typography>

        <Button fullWidth variant="outlined" onClick={createNew} sx={{ mb: 2 }}>
          ➕ Nueva Empresa
        </Button>

        <Divider sx={{ mb: 2 }} />

        <List>
          {empresas.map((e) => (
            <ListItem key={e.id} disablePadding>
              <ListItemButton onClick={() => fetchEmpresa(e.id)}>
                <ListItemText primary={e.nombre} secondary={e.categoria} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
