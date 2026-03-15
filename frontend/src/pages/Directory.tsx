import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import api from '../api';
import type { Employee } from '../types';

export default function Directory() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      api.get('/employees', { params: search ? { search } : {} }).then((r) => setEmployees(r.data));
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <>
      <Typography variant="h4" gutterBottom>Diretório de Colaboradores</Typography>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
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
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">Nenhum colaborador encontrado.</TableCell>
              </TableRow>
            )}
            {employees.map((emp) => (
              <TableRow key={emp.id} hover>
                <TableCell>{emp.name}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.extension}</TableCell>
                <TableCell>{emp.sector}</TableCell>
                <TableCell>{emp.birthday.replace('-', '/')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
