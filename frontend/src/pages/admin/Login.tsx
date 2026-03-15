import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import api from '../../api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/admin');
    } catch {
      setError('Usuário ou senha inválidos.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
      <Card sx={{ minWidth: 340 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">Login Administrativo</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleLogin}>
            <TextField fullWidth label="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 2 }} />
            <Button fullWidth variant="contained" type="submit">Entrar</Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
