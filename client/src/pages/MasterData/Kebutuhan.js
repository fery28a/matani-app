// client/src/pages/MasterData/Kebutuhan.js
import React, { useState, useEffect } from 'react';
import { getKebutuhans, createKebutuhan, updateKebutuhan, deleteKebutuhan } from '../../services/kebutuhanService';

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
  Alert
} from '@mui/material';

// Import ikon Material-UI
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';


function Kebutuhan() {
  const [kebutuhans, setKebutuhans] = useState([]);
  const [namaKebutuhan, setNamaKebutuhan] = useState('');
  const [satuan, setSatuan] = useState('');
  const [harga, setHarga] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchKebutuhans = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getKebutuhans();
      setKebutuhans(data);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memuat data kebutuhan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKebutuhans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!namaKebutuhan || !satuan || !harga) {
      setError('Semua kolom harus diisi!');
      return;
    }

    const kebutuhanData = {
      nama: namaKebutuhan,
      satuan,
      harga: parseFloat(harga),
    };

    setSubmitLoading(true);
    try {
      if (editingId) {
        await updateKebutuhan(editingId, kebutuhanData);
        alert('Kebutuhan berhasil diperbarui!');
      } else {
        await createKebutuhan(kebutuhanData);
        alert('Kebutuhan berhasil ditambahkan!');
      }
      fetchKebutuhans(); // Muat ulang data
      // Reset form
      setNamaKebutuhan('');
      setSatuan('');
      setHarga('');
      setEditingId(null);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan data kebutuhan.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (kebutuhan) => {
    setNamaKebutuhan(kebutuhan.nama);
    setSatuan(kebutuhan.satuan);
    setHarga(kebutuhan.harga.toString());
    setEditingId(kebutuhan._id);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kebutuhan ini?')) {
      setError(null);
      setLoading(true);
      try {
        await deleteKebutuhan(id);
        alert('Kebutuhan berhasil dihapus!');
        fetchKebutuhans();
        if (editingId === id) {
          setEditingId(null);
          setNamaKebutuhan('');
          setSatuan('');
          setHarga('');
        }
      } catch (err) {
        setError(err.message || 'Terjadi kesalahan saat menghapus data kebutuhan.');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setNamaKebutuhan('');
    setSatuan('');
    setHarga('');
    setEditingId(null);
    setError(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Master Data: Kebutuhan
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading && <CircularProgress sx={{ display: 'block', margin: 'auto', mb: 2 }} />}

      {/* Form Input Kebutuhan */}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4, maxWidth: 400 }}>
        <TextField
          label="Nama Kebutuhan"
          variant="outlined"
          fullWidth
          value={namaKebutuhan}
          onChange={(e) => setNamaKebutuhan(e.target.value)}
          required
        />
        <TextField
          label="Satuan"
          variant="outlined"
          fullWidth
          value={satuan}
          onChange={(e) => setSatuan(e.target.value)}
          placeholder="Contoh: Roll / Meter / Buah"
          required
        />
        <TextField
          label="Harga"
          variant="outlined"
          fullWidth
          type="number"
          value={harga}
          onChange={(e) => setHarga(e.target.value)}
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
            {submitLoading ? <CircularProgress size={24} color="inherit" /> : (editingId ? 'Update Kebutuhan' : 'Tambah Kebutuhan')}
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
        Daftar Kebutuhan
      </Typography>

      {kebutuhans.length === 0 && !loading ? (
        <Typography>Belum ada kebutuhan yang ditambahkan.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="kebutuhan table">
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Nama Kebutuhan</TableCell>
                <TableCell>Satuan</TableCell>
                <TableCell align="right">Harga</TableCell>
                <TableCell align="center">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {kebutuhans.map((kebutuhan, index) => (
                <TableRow key={kebutuhan._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{kebutuhan.nama}</TableCell>
                  <TableCell>{kebutuhan.satuan}</TableCell>
                  <TableCell align="right">Rp {kebutuhan.harga.toLocaleString('id-ID')}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="info"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(kebutuhan)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(kebutuhan._id)}
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

export default Kebutuhan;