"use client";

import { motion } from "framer-motion";
import ReactPlayer from "react-player";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Rating,
  Box,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

export const AnimatedPopupContent = ({ place }: { place: any }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
    >
      <Card
        sx={{
          maxWidth: 220,
          boxShadow: "none",
          border: "none",
          position: "relative",
        }}
      >

        <CardMedia
          component="img"
          height="120"
          image={place.photoUrl}
          alt={place.cityName}
          sx={{ borderRadius: "12px 12px 0 0" }}
        />

        {place.musicUrl && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "primary.main",
              borderRadius: "50%",
              p: 0.5,
              display: "flex",
              boxShadow: 2,
            }}
          >
            <MusicNoteIcon sx={{ color: "white", fontSize: 18 }} />
          </Box>
        )}

        <CardContent sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight="700" lineHeight={1.2}>
            {place.cityName}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 1 }}
          >
            Visitado: {place.visitDate}
          </Typography>
          <Rating value={place.rating} readOnly size="small" />
        </CardContent>
      </Card>
    </motion.div>
  );
};
