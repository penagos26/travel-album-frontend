import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Autocomplete,
  Button,
  Rating,
  Stack,
  Box,
  Typography,
  Tab,
  Tabs,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { fileToBase64 } from "../../application/utils/FileToBase64";

export const PlaceModal = ({ open, onClose, onSave, initialData }: any) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0); // 0 para Link, 1 para Archivo
  const [formData, setFormData] = useState<any>(
    initialData || {
      cityName: "",
      rating: 0,
      visitDate: "",
      photoUrl: "",
    },
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // Límite de 2MB para no saturar LocalStorage
        alert("El archivo es muy pesado. Máximo 2MB.");
        return;
      }
      const base64 = await fileToBase64(file);
      setFormData({ ...formData, photoUrl: base64 });
    }
  };

  // Buscador de ciudades gratuito (Nominatim)
  const searchCity = async (query: string) => {
    if (query.length < 3) return;
    setLoading(true);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`,
    );
    const data = await res.json();
    setOptions(
      data.map((item: any) => ({
        label: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
      })),
    );
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? "Editar Lugar" : "Nuevo Lugar"}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <Autocomplete
            options={options}
            loading={loading}
            onInputChange={(e, value) => searchCity(value)}
            onChange={(e, selection: any) => {
              if (selection) {
                setFormData({
                  ...formData,
                  cityName: selection.label,
                  location: { lat: selection.lat, lng: selection.lon },
                  id: new Date().toISOString(),
                });
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Buscar Ciudad" required />
            )}
          />
          <Box>
            <Typography variant="caption" color="textSecondary">
              Imagen del lugar
            </Typography>
            <Tabs
              value={tabValue}
              onChange={(e, v) => setTabValue(v)}
              sx={{ mb: 2 }}
            >
              <Tab label="URL Externa" />
              <Tab label="Subir Archivo" />
            </Tabs>

            {tabValue === 0 ? (
              <TextField
                fullWidth
                label="https://imagen.com/foto.jpg"
                value={
                  formData.photoUrl.startsWith("data:") ? "" : formData.photoUrl
                }
                onChange={(e) =>
                  setFormData({ ...formData, photoUrl: e.target.value })
                }
              />
            ) : (
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{ height: "56px" }}
              >
                {formData.photoUrl.startsWith("data:")
                  ? "Imagen Cargada ✓"
                  : "Seleccionar Imagen"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
            )}
          </Box>

          <TextField
            type="date"
            label="Fecha de Visita"
            InputLabelProps={{ shrink: true }}
            value={formData.visitDate}
            onChange={(e) =>
              setFormData({ ...formData, visitDate: e.target.value })
            }
          />

          <Box>
            <Typography component="legend">Calificación</Typography>
            <Rating
              value={formData.rating}
              onChange={(e, val) =>
                setFormData({ ...formData, rating: val || 0 })
              }
            />
          </Box>

          <TextField
            fullWidth
            label="Link de YouTube (Opcional)"
            placeholder="https://www.youtube.com/watch?v=..."
            value={formData.musicUrl || ""}
            onChange={(e) => {
              const url = e.target.value;
              // Validación básica: que contenga youtube.com o youtu.be
              if (
                url === "" ||
                url.includes("youtube.com") ||
                url.includes("youtu.be")
              ) {
                setFormData({ ...formData, musicUrl: url });
              }
            }}
            helperText="Se reproducirá automáticamente al abrir el marcador"
          />

          <Button
            variant="contained"
            onClick={() => onSave(formData)}
            fullWidth
            size="large"
            disabled={
              !formData.cityName || !formData.photoUrl || !formData.visitDate
            }
          >
            Guardar
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
