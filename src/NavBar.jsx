import React, { useState } from "react";
import {
  AppBar, Box, Toolbar, Typography, Button, IconButton, Drawer,
  List, ListItem, ListItemText
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { motion } from "framer-motion";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const toggleDrawer = (state) => () => setOpen(state);

  const handleLogout = () => {
    Swal.fire({
      title: "Cerrar sesión",
      text: "¿Estás seguro de que deseas cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        Swal.fire({
          title: "Sesión cerrada",
          text: "Has cerrado sesión correctamente.",
          icon: "success",
          timer: 1200,
          showConfirmButton: false,
        });

        setTimeout(() => {
          navigate("/auth/login");
        }, 1200);
      }
    });
  };

  const isAdmin = user?.rol?.toLowerCase() === "admin";

  const links = [
    { label: "Inicio", path: "/" },
    { label: "Mis Turnos", path: "/mis-turnos" },
    ...(isAdmin ? [{ label: "Admin", path: "/admin" }] : []),
    ...(user
      ? [{ label: `Salir (${user.nombre})`, action: handleLogout }]
      : [
          { label: "Login", path: "/auth/login" },
          { label: "Registrarse", path: "/auth/register" },
        ])
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#009688" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2, display: { xs: "flex", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            TurnosApp
          </Typography>

          {/* DESKTOP */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {links.map((link, idx) => (
              <motion.div key={idx} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                {link.action ? (
                  <Button color="inherit" onClick={link.action}
                    sx={{ textTransform: "none", fontSize: "1rem", "&:hover": { color: "#ffe082" } }}>
                    {link.label}
                  </Button>
                ) : (
                  <Button color="inherit" component={RouterLink} to={link.path}
                    sx={{ textTransform: "none", fontSize: "1rem", "&:hover": { color: "#ffe082" } }}>
                    {link.label}
                  </Button>
                )}
              </motion.div>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} onClick={toggleDrawer(false)}>
          <List>
            {links.map((link, idx) => (
              link.action ? (
                <ListItem button key={idx} onClick={link.action}>
                  <ListItemText primary={link.label} />
                </ListItem>
              ) : (
                <ListItem button key={idx} component={RouterLink} to={link.path}>
                  <ListItemText primary={link.label} />
                </ListItem>
              )
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
