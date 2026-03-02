import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';

export const Header = ({ onAddClick }: { onAddClick: () => void }) => (
  <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'rgba(255,255,255,0.9)', color: '#333' }}>
    <Container maxWidth="xl">
      <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight="bold">Mi album de viajes - Carlos Penagos</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddLocationAltIcon />} 
          onClick={onAddClick}
          sx={{ borderRadius: '20px', textTransform: 'none' }}
        >
          Añadir Lugar
        </Button>
      </Toolbar>
    </Container>
  </AppBar>
);