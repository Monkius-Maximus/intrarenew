import { Outlet, Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

export default function PublicLayout() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Portal Intranet
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">Início</Button>
          <Button color="inherit" component={RouterLink} to="/directory">Colaboradores</Button>
          <Button color="inherit" component={RouterLink} to="/admin/login">Admin</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Outlet />
      </Container>
    </>
  );
}
