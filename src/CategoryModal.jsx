import React from "react";
import { Modal, Box, Typography, Grid, Card, CardActionArea } from "@mui/material";
import { motion } from "framer-motion";

export default function CategoryModal({
  open,
  onClose,
  category,
  empresas = [],
  onSelectEmpresa,
}) {
  if (!category) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-category-title"
      aria-describedby="modal-category-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        sx={{
          position: "relative",
          width: { xs: "90%", sm: 500, md: 600 },
          maxHeight: "80vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 3,
          outline: "none",
        }}
      >
        <Typography
        id="modal-category-title" 
                variant="h5"
                sx={{
                  mb: 3,
                  fontWeight: "bold",
                  textAlign: "center",
                  position: "relative",
                  display: "block",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: "50%",
                    height: "3px",
                    backgroundColor: "#c1a3ff",
                    bottom: "-5px",
                    left: "25%",
                    borderRadius: "2px",
                  },
                }}
              >
                Negocios de {category.nombre}
              </Typography>

        <Grid container spacing={2}>
          {Array.isArray(empresas) && empresas.length > 0 ? (
            empresas.map((empresa) => (
              <Grid item xs={12} sm={6} key={empresa.id}>
                <Card
                  component={motion.div}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                  sx={{
                    borderRadius: 2,
                    boxShadow: 3,
                    cursor: "pointer",
                  }}
                >
                  <CardActionArea onClick={() => onSelectEmpresa(empresa)}>
                    <Box sx={{ p: 2, textAlign: "center" }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {empresa.nombre}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {empresa.slogan}
                      </Typography>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", width: "100%", mt: 2 }}
            >
              No hay empresas registradas para esta categoría.
            </Typography>
          )}
        </Grid>
      </Box>
    </Modal>
  );
}
