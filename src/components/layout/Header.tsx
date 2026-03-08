import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import Link from "next/link";

export const Header = ({ onAddClick }: { onAddClick: () => void }) => (
  <AppBar
    position="fixed"
    sx={{
      zIndex: (theme) => theme.zIndex.drawer + 1,
      bgcolor: "rgba(255,255,255,0.9)",
      color: "#333",
    }}
  >
    <Container maxWidth="xl">
      <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight="bold">
          Mi album de viajes - Carlos Penagos
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Button color="inherit">Mapa</Button>
          </Link>
          <Link
            href="/places"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Button color="inherit">Lista</Button>
          </Link>
          <Button
            variant="contained"
            startIcon={<AddLocationAltIcon />}
            onClick={onAddClick}
            sx={{ borderRadius: "20px", textTransform: "none" }}
          >
            Añadir Lugar
          </Button>
        </Box>
      </Toolbar>
    </Container>
  </AppBar>
);
