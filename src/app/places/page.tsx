"use client";
import React from "react";

import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Rating,
  Box,
  Button,
  Chip,
} from "@mui/material";
import { usePlaces } from "../../application/hooks/usePlaces";
import { Header } from "../../components/layout/Header";
import MapIcon from "@mui/icons-material/Map";
import Link from "next/link";
import { PlaceSidebar } from "../../components/sidebar/PlaceSidebar";

export default function PlacesListPage() {
  const { places } = usePlaces();
  const [selectedPlace, setSelectedPlace] = React.useState<any | null>(null);

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Header onAddClick={() => {}} />
      <Container maxWidth="lg" sx={{ mt: "64px", pt: 4, pb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 4,
            alignItems: "center",
          }}
        >
          <Typography variant="h4" color="black" fontWeight="bold">
            Mis Destinos
          </Typography>
          <Link href="/" passHref>
            <Button variant="outlined" startIcon={<MapIcon />}>
              Volver al Mapa
            </Button>
          </Link>
        </Box>

        {places.length === 0 ? (
          <Typography
            variant="h6"
            color="textSecondary"
            textAlign="center"
            sx={{ mt: 10 }}
          >
            Aún no has añadido lugares. ¡Empieza a explorar!
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {places
              .sort(
                (a, b) =>
                  new Date(a.visitDate).getTime() -
                  new Date(b.visitDate).getTime(),
              )
              .map((place) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={place.id}>
                  <Card
                    sx={{
                      borderRadius: 4,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s",
                      cursor: "pointer",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                    onClick={() => setSelectedPlace(place)}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        height: 200,
                        objectFit: "cover",
                        borderRadius: "16px 16px 0 0",
                      }}
                      image={place.photoUrl}
                      alt={place.cityName}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {place.cityName}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          {place.visitDate}
                        </Typography>
                        <Rating value={place.rating} readOnly size="small" />
                      </Box>
                      {place.musicUrl && (
                        <Chip
                          label="Tiene música"
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        )}
        <PlaceSidebar
          open={!!selectedPlace}
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
          style={{ marginTop: "64px" }}
        />
      </Container>
    </Box>
  );
}
