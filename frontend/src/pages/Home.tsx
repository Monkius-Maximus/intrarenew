import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import CakeIcon from '@mui/icons-material/Cake';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import LinkIcon from '@mui/icons-material/Link';
import api from '../api';
import type { Announcement, Link as LinkType, Employee } from '../types';

export default function Home() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [birthdays, setBirthdays] = useState<Employee[]>([]);

  useEffect(() => {
    api.get('/announcements').then((r) => setAnnouncements(r.data));
    api.get('/links').then((r) => setLinks(r.data));
    api.get('/employees/birthdays').then((r) => setBirthdays(r.data));
  }, []);

  return (
    <Grid container spacing={3}>
      {birthdays.length > 0 && (
        <Grid size={12}>
          <Card sx={{ bgcolor: 'warning.light' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CakeIcon sx={{ mr: 1 }} />
                <Typography variant="h6">🎂 Aniversariantes do Mês</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {birthdays.map((emp) => (
                  <Chip key={emp.id} label={`${emp.name} (${emp.birthday.replace('-', '/')})`} color="warning" />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}

      <Grid size={{ xs: 12, md: 8 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AnnouncementIcon /> Comunicados
        </Typography>
        {announcements.length === 0 && <Typography color="text.secondary">Nenhum comunicado.</Typography>}
        {announcements.map((ann) => (
          <Card key={ann.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{ann.title}</Typography>
              <Typography color="text.secondary" variant="caption">
                {new Date(ann.createdAt).toLocaleDateString('pt-BR')}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography>{ann.message}</Typography>
            </CardContent>
          </Card>
        ))}
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinkIcon /> Links Úteis
        </Typography>
        {links.length === 0 && <Typography color="text.secondary">Nenhum link cadastrado.</Typography>}
        <Card>
          <CardContent>
            {links.map((link) => (
              <Box key={link.id} sx={{ mb: 1 }}>
                <Link href={link.url} target="_blank" rel="noopener noreferrer">{link.name}</Link>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
