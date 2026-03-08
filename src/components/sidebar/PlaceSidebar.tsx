'use client';

import { Drawer, Box, Typography, Divider, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { getPlaceDetails } from '../../infraestructure/Gemini';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const MiniMap = dynamic(() => import('../map/MiniMap'), { ssr: false });

export const PlaceSidebar = ({ place, open, onClose }: any) => {
  const [aiData, setAiData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && place) {
      setLoading(true);
      getPlaceDetails(place.cityName)
        .then(data => setAiData(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [open, place]);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, p: 3, mt: '64px' }}>
        {place && (
          <>
            <Box sx={{ height: 200, my: 2, borderRadius: 2, overflow: 'hidden', border: '1px solid #ddd' }}>
              <Image src={place.photoUrl} alt={place.cityName} height={200} width={300} objectFit="cover" />
            </Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>{place.cityName}</Typography>
            
            {/* 1. Ubicación en el mapa (Miniatura) */}
            <Box sx={{ height: 200, my: 2, borderRadius: 2, overflow: 'hidden', border: '1px solid #ddd' }}>
              <MiniMap location={place.location} />
            </Box>

            <Divider sx={{ my: 2 }} />

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>
            ) : (
              <>
                {/* 2. Descripción en Español (vía Gemini) */}
                <Typography variant="subtitle1" fontWeight="bold" color="primary">Sobre este lugar</Typography>
                <Typography variant="body2" sx={{ mb: 3 }}>{aiData?.descripcion}</Typography>

                {/* 3. Sitios de interés (vía Gemini) */}
                <Typography variant="subtitle1" fontWeight="bold" color="primary">Sitios de interés</Typography>
                <List>
                  {aiData?.sitiosInteres?.map((sitio: string, i: number) => (
                    <ListItem key={i} disableGutters>
                      <ListItemText primary={`• ${sitio}`} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </>
        )}
      </Box>
    </Drawer>
  );
};