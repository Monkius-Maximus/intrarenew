import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import LinkIcon from '@mui/icons-material/Link';

const tiles = [
  { label: 'Colaboradores', path: '/admin/employees', icon: <PeopleIcon fontSize="large" /> },
  { label: 'Comunicados', path: '/admin/announcements', icon: <AnnouncementIcon fontSize="large" /> },
  { label: 'Links Úteis', path: '/admin/links', icon: <LinkIcon fontSize="large" /> },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  return (
    <>
      <Typography variant="h4" gutterBottom>Painel Administrativo</Typography>
      <Grid container spacing={3}>
        {tiles.map((tile) => (
          <Grid size={{ xs: 12, sm: 4 }} key={tile.path}>
            <Card>
              <CardActionArea onClick={() => navigate(tile.path)} sx={{ p: 3, textAlign: 'center' }}>
                {tile.icon}
                <CardContent>
                  <Typography variant="h6">{tile.label}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
