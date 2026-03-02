"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Rating,
  Button,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Place } from "../../core/models/Place";
import { AnimatedPopupContent } from "./AnimatedPopupContent";

// Fix para los iconos de Leaflet en Next.js
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface HomeMapProps {
  places: Place[];
  onEditPlace: (place: Place) => void;
  onMarkerClick: (place: Place) => void;
}

export const HomeMap = ({ places, onEditPlace, onMarkerClick }: HomeMapProps) => {
  const bogotaCoords: [number, number] = [4.6097, -74.0817];

  return (
    <Box sx={{ height: "calc(100vh - 64px)", width: "100%" }}>
      <MapContainer
        center={bogotaCoords}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.location.lat, place.location.lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => onMarkerClick(place),
            }}
          >
            <Popup>
              <AnimatedPopupContent place={place} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};
