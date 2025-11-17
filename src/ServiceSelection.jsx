import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardActionArea } from "@mui/material";
import { motion } from "framer-motion";
import CategoryModal from "./CategoryModal";
import axios from "axios";

import ContentCutIcon from "./assets/barber-shop.png";   
import FitnessCenterIcon from "./assets/weightlifter.png"; 
import SpaIcon from "./assets/head-massage.png";            
import FaceRetouchingNaturalIcon from "./assets/makeup.png"; 
import EmojiPeopleIcon from "./assets/tattoo.png";     
import ContentPasteGoIcon from "./assets/hair-removal.png"; 

export default function ServiceSelection({ onSelectEmpresa }) {
  const [categorias, setCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const iconMap = {
    Peluquería: <img src={ContentCutIcon} alt="Peluquería" style={{ width: 50, height: 50 }} />,
    Gimnasio: <img src={FitnessCenterIcon} alt="Gimnasio" style={{ width: 50, height: 50 }} />,
    Masajes: <img src={SpaIcon} alt="Masajes" style={{ width: 50, height: 50 }} />,
    Estética: <img src={FaceRetouchingNaturalIcon} alt="Estética" style={{ width: 50, height: 50 }} />,
    Depilación: <img src={ContentPasteGoIcon} alt="Depilación" style={{ width: 50, height: 50 }} />,
    Tatuajes: <img src={EmojiPeopleIcon} alt="Tatuajes" style={{ width: 50, height: 50 }} />,
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/categorias")
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error("Error al obtener categorías:", err));
  }, []);

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setOpenModal(true);
    try {
      const res = await axios.get(`http://localhost:3001/api/empresas/categoria/${category.id}`);
      setEmpresas(res.data || []);
    } catch (err) {
      console.error("Error al obtener empresas:", err);
      setEmpresas([]);
    }
  };


  return (
    <Box
      sx={{
        minHeight: "auto",
        background: "linear-gradient(180deg, #f3e7ff 0%, #ffffff 100%)",
        textAlign: "center",
        py: 6,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            color: "#3b0a45",
            mb: 2,
            textShadow: "1px 1px 4px rgba(0,0,0,0.1)",
          }}
        >
          Bienvenido a TurnosApp
        </Typography>
      </motion.div>

      <Typography
        variant="h5"
        sx={{
          color: "#5e3a00",
          mb: 4,
          fontWeight: "600",
          position: "relative",
          display: "inline-block",
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
        Servicios
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {categorias.map((categoria) => (
          <Grid key={categoria.id}>
            <Card
              component={motion.div}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              sx={{
                width: 140,
                textAlign: "center",
                p: 2,
                borderRadius: 3,
                boxShadow: 4,
                cursor: "pointer",
              }}
            >
              <CardActionArea onClick={() => handleCategoryClick(categoria)}>
                {iconMap[categoria.nombre] || (
                  <img src={SpaIcon} alt="Servicio" style={{ width: 50, height: 50 }} />
                )}

                <Typography variant="body1" sx={{ mt: 1 }}>
                  {categoria.nombre}
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <CategoryModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        category={selectedCategory}
        empresas={empresas}
        onSelectEmpresa={(empresa) => {
          onSelectEmpresa(empresa);
          setOpenModal(false);
        }}
      />
    </Box>
  );
}
