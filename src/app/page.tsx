"use client";

import React, { useState, useEffect } from "react";
import { Box, Toolbar, Fab, Snackbar, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Header } from "../components/layout/Header";
import { PlaceModal } from "../components/forms/PlaceModal";
import { usePlaces } from "../application/hooks/usePlaces";
import { Place } from "../core/models/Place";
import dynamic from "next/dynamic";
import { MusicBanner } from "../components/layout/MusicBanner";

const HomeMap = dynamic(
  () => import("../components/map/HomeMap").then((mod) => mod.HomeMap),
  {
    ssr: false,
    loading: () => (
      <Box sx={{ height: "calc(100vh - 64px)", bgcolor: "#f0f0f0" }} />
    ),
  },
);

export default function HomePage() {
  const { places, addPlace, updatePlace, activeMusic, handleMarkerClick } = usePlaces();

  // Estados para el Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // Estado para feedback visual
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "info",
  });

  const handleOpenAdd = () => {
    setSelectedPlace(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (place: Place) => {
    setSelectedPlace(place);
    setIsModalOpen(true);
  };

  const handleSavePlace = (data: Place) => {
    if (selectedPlace) {
      updatePlace(data);
      setNotification({
        open: true,
        message: "Lugar actualizado correctamente",
        severity: "info",
      });
    } else {
      addPlace(data);
      setNotification({
        open: true,
        message: "¡Nuevo lugar explorado y guardado!",
        severity: "success",
      });
    }
    setIsModalOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* Header con el botón de añadir */}
      <Header onAddClick={handleOpenAdd} />

      {/* Spacer para evitar que el contenido quede debajo del Header fixed */}
      <Toolbar />

      <Box component="main" sx={{ flexGrow: 1, position: "relative" }}>
        <HomeMap places={places} onEditPlace={handleOpenEdit} onMarkerClick={handleMarkerClick} />

        {/* Botón flotante (FAB) para móvil o acceso rápido */}
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleOpenAdd}
          sx={{ position: "absolute", bottom: 20, right: 20, zIndex: 1000 }}
        >
          <AddIcon />
        </Fab>
      </Box>

      {/* El banner de música está FUERA del mapa */}
      <MusicBanner music={activeMusic} onClose={() => handleMarkerClick(null)} />

      {/* Modal único para Crear/Editar */}
      {isModalOpen && (
        <PlaceModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSavePlace}
          initialData={selectedPlace}
        />
      )}

      {/* Notificaciones Toast */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
