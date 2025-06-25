// client/src/pages/MasterData/Pupuk.js
import React, { useState, useEffect } from 'react';
import { getPupuks, createPupuk, updatePupuk, deletePupuk } from '../../services/pupukService';

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
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';

// Import ikon Material-UI
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';


function Pupuk() {
  const [pupuks, setPupuks] = useState([]);
  const [namaPupuk, setNamaPupuk] = useState('');
  const [jenisPupuk, setJenisPupuk] = useState('');
  const [satuanPupuk, setSatuanPupuk] = useState('Kg'); // Default Kg
  const [hargaPupuk, setHargaPupuk] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchPupuks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPupuks();
      setPupuks(data);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memuat data pupuk.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPupuks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!namaPupuk || !jenisPupuk || !satuanPupuk || !hargaPupuk) {
      setError('Semua kolom harus diisi!');
      return;
    }

    const pupukData = {
      nama: namaPupuk,
      jenis: jenisPupuk,
      satuan: satuanPupuk,
      harga: parseFloat(hargaPupuk),
    };

    setSubmitLoading(true);
    try {
      if (editingId) {
        await updatePupuk(editingId, pupukData);
        alert('Pupuk berhasil diperbarui!');
      } else {
        await createPupuk(pupukData);
        alert('Pupuk berhasil ditambahkan!');
      }
      fetchPupuks(); // Muat ulang data
      // Reset form
      setNamaPupuk('');
      setJenisPupuk('');
      setSatuanPupuk('Kg');
      setHargaPupuk('');
      setEditingId(null);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan data pupuk.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (pupuk) => {
    setNamaPupuk(pupuk.nama);
    setJenisPupuk(pupuk.jenis);
    setSatuanPupuk(pupuk.satuan);
    setHargaPupuk(pupuk.harga.toString());
    setEditingId(pupuk._id);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pupuk ini?')) {
      setError(null);
      setLoading(true);
      try {
        await deletePupuk(id);
        alert('Pupuk berhasil dihapus!');
        fetchPupuks();
        if (editingId === id) {
          setEditingId(null);
          setNamaPupuk('');
          setJenisPupuk('');
          setSatuanPupuk('Kg');
          setHargaPupuk('');
        }
      } catch (err) {
        setError(err.message || 'Terjadi kesalahan saat menghapus data pupuk.');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setNamaPupuk('');
    setJenisPupuk('');
    setSatuanPupuk('Kg');
    setHargaPupuk('');
    setEditingId(null);
    setError(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Master Data: Pupuk
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading && <CircularProgress sx={{ display: 'block', margin: 'auto', mb: 2 }} />}

      {/* Form Input Pupuk */}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4, maxWidth: 400 }}>
        <TextField
          label="Nama Pupuk"
          variant="outlined"
          fullWidth
          value={namaPupuk}
          onChange={(e) => setNamaPupuk(e.target.value)}
          required
        />
        <TextField
          label="Jenis"
          variant="outlined"
          fullWidth
          value={jenisPupuk}
          onChange={(e) => setJenisPupuk(e.target.value)}
          required
        />
        <FormControl fullWidth variant="outlined" required>
          <InputLabel>Satuan</InputLabel>
          <Select
            value={satuanPupuk}
            onChange={(e) => setSatuanPupuk(e.target.value)}
            label="Satuan"
          >
            <MenuItem value="Kg">Kg</MenuItem>
            <MenuItem value="Karung">Karung</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Harga"
          variant="outlined"
          fullWidth
          type="number"
          value={hargaPupuk}
          onChange={(e) => setHargaPupuk(e.target.value)}
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
            {submitLoading ? <CircularProgress size={24} color="inherit" /> : (editingId ? 'Update Pupuk' : 'Tambah Pupuk')}
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
        Daftar Pupuk
      </Typography>

      {pupuks.length === 0 && !loading ? (
        <Typography>Belum ada pupuk yang ditambahkan.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="pupuk table">
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
              {pupuks.map((pupuk, index) => (
                <TableRow key={pupuk._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{pupuk.nama}</TableCell>
                  <TableCell>{pupuk.jenis}</TableCell>
                  <TableCell>{pupuk.satuan}</TableCell>
                  <TableCell align="right">Rp {pupuk.harga.toLocaleString('id-ID')}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="info"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(pupuk)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(pupuk._id)}
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

export default Pupuk;