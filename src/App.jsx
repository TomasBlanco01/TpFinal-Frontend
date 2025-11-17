import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import AdminPage from "./AdminPage";
import LoginPage from "./LoginPage";
import MisTurnosPage from "./MisTurnosPage";
import RegisterPage from "./RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import ServiceSelection from "./ServiceSelection";
import ModalTurnos from "./ModalTurnos";

const HomePage = () => {
  const [selectedEmpresa, setSelectedEmpresa] = React.useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = React.useState("");
  const [openModal, setOpenModal] = React.useState(false);

  const handleOpenModal = () => {
    if (!fechaSeleccionada) {
      alert("Selecciona una fecha antes de ver los turnos disponibles.");
      return;
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  return (
    <div>
      <Box sx={{ textAlign: "center", p: 4 }}>
        <ServiceSelection onSelectEmpresa={(empresa) => setSelectedEmpresa(empresa)} />

        <AnimatePresence>
          {selectedEmpresa && (
            <motion.div
              key={selectedEmpresa.id || selectedEmpresa.nombre}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.9 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "2rem",
              }}
            >
              <Card
                sx={{
                  width: 400,
                  textAlign: "center",
                  borderRadius: 3,
                  boxShadow: 6,
                  p: 3,
                  background: "linear-gradient(180deg, #ffffff 0%, #f8f5ff 100%)",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", mb: 1, color: "#4A148C" }}
                  >
                    {selectedEmpresa.nombre}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {selectedEmpresa.slogan}
                  </Typography>

                  <Box sx={{ my: 2 }}>
                    <label htmlFor="fecha" style={{ fontWeight: "bold" }}>
                      Selecciona una fecha:
                    </label>
                    <input
                      id="fecha"
                      type="date"
                      value={fechaSeleccionada}
                      onChange={(e) => setFechaSeleccionada(e.target.value)}
                      style={{
                        marginLeft: "10px",
                        padding: "6px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        cursor: "pointer",
                      }}
                    />
                  </Box>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleOpenModal}
                      sx={{ mt: 2 }}
                      variant="contained"
                      color="secondary"
                    >
                      Ver Turnos Disponibles
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {selectedEmpresa && (
          <ModalTurnos
            open={openModal}
            onClose={handleCloseModal}
            empresa={selectedEmpresa}
            fechaSeleccionada={fechaSeleccionada}
          />
        )}
      </Box>
    </div>
  );
};

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/mis-turnos" element={<MisTurnosPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}
