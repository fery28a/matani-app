// client/src/pages/Auth/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, getUserInfo } from '../../services/authService';

// Import komponen Material-UI
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';

import LoginIcon from '@mui/icons-material/Login';


function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      navigate('/'); // Redirect ke Dashboard jika sudah login
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await login(username, password);
      // alert(`Login berhasil! Selamat datang, ${data.username}!`);
      navigate('/'); // Redirect ke Dashboard setelah login berhasil
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa username dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: '#f4f7f6', // Background yang sama dengan body
      }}
    >
      <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 400, width: '100%' }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Login Matani
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<LoginIcon />}
            disabled={loading}
            sx={{ py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;