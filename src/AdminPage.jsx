import React, { useEffect, useState } from "react";
import {
  Box, Typography, TextField, Button, Grid, Paper, Divider, MenuItem
} from "@mui/material";
import { motion } from "framer-motion";
import api from "./api"; // <-- asegurate que la ruta sea correcta

export default function AdminPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [empresas, setEmpresas] = useState([]);
  const [selectedId, setSelectedId] = useState("");
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

  const fetchEmpresas = async () => {
    try {
      const res = await api.get("/empresas");
      setEmpresas(res.data ?? []);
    } catch (err) {
      console.error("fetchEmpresas:", err);
      alert("Error al cargar empresas ❌\n" + (err.response?.data?.message || err.message));
    }
  };

  const fetchEmpresa = async (id) => {
    if (!id) return;
    try {
      const res = await api.get(`/empresas/${id}`);
      const data = res.data ?? {};
      setForm({
        id: data.id ?? "",
        nombre: data.nombre ?? "",
        direccion: data.direccion ?? "",
        telefono: data.telefono ?? "",
        slogan: data.slogan ?? "",
        duracion_turno_min: data.duracion_turno_min ?? "",
        categoria_id: data.categoria_id ?? "",
        admin_id: data.admin_id ?? user?.id ?? null,
      });
    } catch (err) {
      console.error("fetchEmpresa:", err);
      alert("Error al cargar datos de la empresa ❌\n" + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    fetchEmpresas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectEmpresa = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    if (id === "new") {
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
    } else {
      fetchEmpresa(id);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // si el campo es duracion_turno_min lo convertimos a número (opcional)
    if (name === "duracion_turno_min") {
      const numeric = value === "" ? "" : Number(value);
      setForm((p) => ({ ...p, [name]: numeric }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (form.id) {
        await api.put(`/empresas/${form.id}`, form);
        alert("Cambios guardados correctamente ✔");
      } else {
        const res = await api.post("/empresas", form);
        // si la API devuelve la empresa creada, la seleccionamos
        const created = res.data ?? null;
        if (created?.id) {
          setSelectedId(created.id);
          setForm({
            id: created.id,
            nombre: created.nombre ?? "",
            direccion: created.direccion ?? "",
            telefono: created.telefono ?? "",
            slogan: created.slogan ?? "",
            duracion_turno_min: created.duracion_turno_min ?? "",
            categoria_id: created.categoria_id ?? "",
            admin_id: created.admin_id ?? user?.id ?? null,
          });
          alert("Empresa creada correctamente 🎉");
        } else {
          alert("Empresa creada correctamente 🎉");
        }
      }
      await fetchEmpresas();
    } catch (err) {
      console.error("handleSave:", err);
      alert("Error al guardar empresa ❌\n" + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!form.id) return alert("No hay empresa para eliminar");
    if (!window.confirm("¿Eliminar esta empresa?")) return;
    try {
      setLoading(true);
      await api.delete(`/empresas/${form.id}`);
      alert("Empresa eliminada ✔");
      setSelectedId("");
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
      await fetchEmpresas();
    } catch (err) {
      console.error("handleDelete:", err);
      alert("Error al eliminar empresa ❌\n" + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: "auto", display: "flex", justifyContent: "center", p: 4,
      background: "linear-gradient(180deg, #EDE7F6 0%, #ffffff 100%)"
    }}>
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{ p: 4, width: "100%", maxWidth: 750, borderRadius: 4, boxShadow: 6 }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#4A148C", mb: 2, textAlign: "center" }}>
          🛠 Panel de Administración
        </Typography>

        <Typography variant="subtitle1" sx={{ mb: 3, textAlign: "center", opacity: 0.8 }}>
          Gestiona empresas, crea nuevas o edita sus datos
        </Typography>

        <TextField
          select
          fullWidth
          label="Seleccionar Empresa"
          value={selectedId}
          onChange={handleSelectEmpresa}
          sx={{ mb: 3 }}
        >
          {empresas.map((e) => (
            <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>
          ))}
          <MenuItem value="new">➕ Nueva empresa</MenuItem>
        </TextField>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          {Object.entries(form).filter(([k]) => k !== "id" && k !== "admin_id")
            .map(([key, value]) => (
              <Grid item xs={12} key={key}>
                <TextField
                  fullWidth
                  label={key.replace(/_/g, " ").toUpperCase()}
                  name={key}
                  value={value ?? ""}
                  onChange={handleChange}
                  // si es duracion_turno_min mostramos type number
                  type={key === "duracion_turno_min" ? "number" : "text"}
                />
              </Grid>
            ))}
        </Grid>

        <Box mt={4} display="flex" gap={2} justifyContent="center">
          <Button variant="contained" onClick={handleSave} disabled={loading}>
            {loading ? "Guardando..." : form.id ? "Guardar Cambios" : "Crear Empresa"}
          </Button>

          {form.id && (
            <Button variant="outlined" color="error" onClick={handleDelete} disabled={loading}>
              Eliminar
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
