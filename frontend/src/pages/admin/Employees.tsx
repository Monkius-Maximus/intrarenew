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
import type { Employee } from '../../types';

const emptyForm = { name: '', email: '', extension: '', sector: '', birthday: '' };

export default function AdminEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = () => api.get('/employees').then((r) => setEmployees(r.data));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (emp: Employee) => { setEditing(emp); setForm({ name: emp.name, email: emp.email, extension: emp.extension, sector: emp.sector, birthday: emp.birthday }); setOpen(true); };
  const handleSave = async () => {
    if (editing) {
      await api.put(`/employees/${editing.id}`, form);
    } else {
      await api.post('/employees', form);
    }
    setOpen(false);
    load();
  };
  const handleDelete = async () => {
    if (deleteId !== null) {
      await api.delete(`/employees/${deleteId}`);
      setDeleteId(null);
      load();
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Colaboradores</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>Adicionar</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white' }}>Nome</TableCell>
              <TableCell sx={{ color: 'white' }}>E-mail</TableCell>
              <TableCell sx={{ color: 'white' }}>Ramal</TableCell>
              <TableCell sx={{ color: 'white' }}>Setor</TableCell>
              <TableCell sx={{ color: 'white' }}>Aniversário</TableCell>
              <TableCell sx={{ color: 'white' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.id} hover>
                <TableCell>{emp.name}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.extension}</TableCell>
                <TableCell>{emp.sector}</TableCell>
                <TableCell>{emp.birthday}</TableCell>
                <TableCell>
                  <IconButton onClick={() => openEdit(emp)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => setDeleteId(emp.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Editar Colaborador' : 'Adicionar Colaborador'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField label="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField label="E-mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <TextField label="Ramal" value={form.extension} onChange={(e) => setForm({ ...form, extension: e.target.value })} />
          <TextField label="Setor" value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} />
          <TextField label="Aniversário (MM-DD)" value={form.birthday} onChange={(e) => setForm({ ...form, birthday: e.target.value })} placeholder="03-15" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Salvar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>Tem certeza que deseja excluir este colaborador?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Excluir</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
