// client/src/pages/MasterData/Benih.js
import React, { useState, useEffect } from 'react';
import { getBenihs, createBenih, updateBenih, deleteBenih } from '../../services/benihService';

// Import komponen Material-UI
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  CircularProgress,
  Alert,
  MenuItem, // Digunakan untuk Select
  Select,   // Komponen Select
  InputLabel, // Label untuk Select
  FormControl // Wrapper untuk Select
} from '@mui/material';

// Import ikon Material-UI
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';


function Benih() {
  const [benihs, setBenihs] = useState([]);
  const [namaBenih, setNamaBenih] = useState('');
  const [jenisBenih, setJenisBenih] = useState('');
  const [satuanBenih, setSatuanBenih] = useState('Pcs'); // Default Pcs
  const [hargaBenih, setHargaBenih] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchBenihs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBenihs();
      setBenihs(data);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memuat data benih.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBenihs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!namaBenih || !jenisBenih || !satuanBenih || !hargaBenih) {
      setError('Semua kolom harus diisi!');
      return;
    }

    const benihData = {
      nama: namaBenih,
      jenis: jenisBenih,
      satuan: satuanBenih,
      harga: parseFloat(hargaBenih),
    };

    setSubmitLoading(true);
    try {
      if (editingId) {
        await updateBenih(editingId, benihData);
        alert('Benih berhasil diperbarui!');
      } else {
        await createBenih(benihData);
        alert('Benih berhasil ditambahkan!');
      }
      fetchBenihs(); // Muat ulang data
      // Reset form
      setNamaBenih('');
      setJenisBenih('');
      setSatuanBenih('Pcs');
      setHargaBenih('');
      setEditingId(null);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan data benih.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (benih) => {
    setNamaBenih(benih.nama);
    setJenisBenih(benih.jenis);
    setSatuanBenih(benih.satuan);
    setHargaBenih(benih.harga.toString());
    setEditingId(benih._id);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus benih ini?')) {
      setError(null);
      setLoading(true);
      try {
        await deleteBenih(id);
        alert('Benih berhasil dihapus!');
        fetchBenihs();
        if (editingId === id) {
          setEditingId(null);
          setNamaBenih('');
          setJenisBenih('');
          setSatuanBenih('Pcs');
          setHargaBenih('');
        }
      } catch (err) {
        setError(err.message || 'Terjadi kesalahan saat menghapus data benih.');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setNamaBenih('');
    setJenisBenih('');
    setSatuanBenih('Pcs');
    setHargaBenih('');
    setEditingId(null);
    setError(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Master Data: Benih
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading && <CircularProgress sx={{ display: 'block', margin: 'auto', mb: 2 }} />}

      {/* Form Input Benih */}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4, maxWidth: 400 }}>
        <TextField
          label="Nama Benih"
          variant="outlined"
          fullWidth
          value={namaBenih}
          onChange={(e) => setNamaBenih(e.target.value)}
          required
        />
        <TextField
          label="Jenis"
          variant="outlined"
          fullWidth
          value={jenisBenih}
          onChange={(e) => setJenisBenih(e.target.value)}
          required
        />
        <FormControl fullWidth variant="outlined" required>
          <InputLabel>Satuan</InputLabel>
          <Select
            value={satuanBenih}
            onChange={(e) => setSatuanBenih(e.target.value)}
            label="Satuan"
          >
            <MenuItem value="Pcs">Pcs</MenuItem>
            <MenuItem value="Kg">Kg</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Harga"
          variant="outlined"
          fullWidth
          type="number"
          value={hargaBenih}
          onChange={(e) => setHargaBenih(e.target.value)}
          required
          inputProps={{ min: 0 }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={editingId ? <EditIcon /> : <AddIcon />}
            disabled={submitLoading}
          >
            {submitLoading ? <CircularProgress size={24} color="inherit" /> : (editingId ? 'Update Benih' : 'Tambah Benih')}
          </Button>
          {editingId && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={resetForm}
              disabled={submitLoading}
            >
              Batal Edit
            </Button>
          )}
        </Box>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Daftar Benih
      </Typography>

      {benihs.length === 0 && !loading ? (
        <Typography>Belum ada benih yang ditambahkan.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="benih table">
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Nama</TableCell>
                <TableCell>Jenis</TableCell>
                <TableCell>Satuan</TableCell>
                <TableCell align="right">Harga</TableCell>
                <TableCell align="center">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {benihs.map((benih, index) => (
                <TableRow key={benih._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{benih.nama}</TableCell>
                  <TableCell>{benih.jenis}</TableCell>
                  <TableCell>{benih.satuan}</TableCell>
                  <TableCell align="right">Rp {benih.harga.toLocaleString('id-ID')}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="info"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(benih)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(benih._id)}
                    >
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default Benih;