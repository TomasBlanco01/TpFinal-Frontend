import React, { useEffect, useState } from "react";
import {
  Box, Typography, TextField, Button, Grid, Paper, Divider, MenuItem
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";

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
    admin_id: user?.id || null,
  });

  const fetchEmpresas = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/empresas");
      setEmpresas(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar empresas ❌");
    }
  };


  const fetchEmpresa = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/empresas/${id}`);
      setForm(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar datos de la empresa ❌");
    }
  };

  useEffect(() => {
    fetchEmpresas();
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
        admin_id: user?.id || null,
      });
    } else {
      fetchEmpresa(id);
    }
  };

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));


  const handleSave = async () => {
    try {
      setLoading(true);
      if (form.id) {
        await axios.put(`http://localhost:3001/api/empresas/${form.id}`, form);
        alert("Cambios guardados correctamente ✔");
      } else {
        await axios.post("http://localhost:3001/api/empresas", form);
        alert("Empresa creada correctamente 🎉");
      }
      fetchEmpresas();
    } catch (err) {
      console.error(err);
      alert("Error al guardar empresa ❌");
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async () => {
    if (!form.id) return alert("No hay empresa para eliminar");
    if (!window.confirm("¿Eliminar esta empresa?")) return;
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3001/api/empresas/${form.id}`);
      alert("Empresa eliminada ❌");
      setSelectedId("");
      fetchEmpresas();
      setForm({
        id: "",
        nombre: "",
        direccion: "",
        telefono: "",
        slogan: "",
        duracion_turno_min: "",
        categoria_id: "",
        admin_id: user?.id || null,
      });
    } catch (err) {
      console.error(err);
      alert("Error al eliminar empresa ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: "auto", display: "flex", justifyContent: "center", p: 4,
      background: "linear-gradient(180deg, #EDE7F6 0%, #ffffff 100%)"
    }}
    >
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

        <TextField select fullWidth label="Seleccionar Empresa"
          value={selectedId} onChange={handleSelectEmpresa} sx={{ mb: 3 }}
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
                  value={value || ""}
                  onChange={handleChange}
                />
              </Grid>
            ))}
        </Grid>

        <Box mt={4} display="flex" gap={2} justifyContent="center">
          <Button variant="contained" onClick={handleSave} disabled={loading}>
            {loading ? "Guardando..." : form.id ? "Guardar Cambios" : "Crear Empresa"}
          </Button>

          {form.id && (
            <Button variant="outlined" color="error" onClick={handleDelete}>
              Eliminar
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
