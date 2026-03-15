import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from '../../api';
import type { Announcement } from '../../types';

const emptyForm = { title: '', message: '' };

export default function AdminAnnouncements() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = () => api.get('/announcements').then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (item: Announcement) => { setEditing(item); setForm({ title: item.title, message: item.message }); setOpen(true); };
  const handleSave = async () => {
    if (editing) {
      await api.put(`/announcements/${editing.id}`, form);
    } else {
      await api.post('/announcements', form);
    }
    setOpen(false);
    load();
  };
  const handleDelete = async () => {
    if (deleteId !== null) {
      await api.delete(`/announcements/${deleteId}`);
      setDeleteId(null);
      load();
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Comunicados</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>Adicionar</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white' }}>Título</TableCell>
              <TableCell sx={{ color: 'white' }}>Mensagem</TableCell>
              <TableCell sx={{ color: 'white' }}>Data</TableCell>
              <TableCell sx={{ color: 'white' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>{item.title}</TableCell>
                <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.message}</TableCell>
                <TableCell>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  <IconButton onClick={() => openEdit(item)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => setDeleteId(item.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Editar Comunicado' : 'Adicionar Comunicado'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <TextField label="Mensagem" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} multiline rows={4} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Salvar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>Tem certeza que deseja excluir este comunicado?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Excluir</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
