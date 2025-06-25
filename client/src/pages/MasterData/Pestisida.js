// client/src/pages/MasterData/Pestisida.js
import React, { useState, useEffect } from 'react';
import { getPestisidas, createPestisida, updatePestisida, deletePestisida } from '../../services/pestisidaService';

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


function Pestisida() {
  const [pestisidas, setPestisidas] = useState([]);
  const [namaDagang, setNamaDagang] = useState('');
  const [jenisPestisida, setJenisPestisida] = useState('Fungisida'); // Default jenis
  const [bahanAktif, setBahanAktif] = useState('');
  const [beratVolume, setBeratVolume] = useState('');
  const [satuan, setSatuan] = useState('Gram'); // Default satuan
  const [harga, setHarga] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const jenisPestisidaOptions = [
    'Fungisida', 'Insektisida', 'Bakterisida', 'Nematisida', 'Herbisida', 'Surfaktan', 'Zpt', 'Nutrisi'
  ];
  const satuanOptions = ['Gram', 'Ml'];

  const fetchPestisidas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPestisidas();
      setPestisidas(data);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memuat data pestisida.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPestisidas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!namaDagang || !jenisPestisida || !bahanAktif || !beratVolume || !satuan || !harga) {
      setError('Semua kolom harus diisi!');
      return;
    }

    const pestisidaData = {
      namaDagang,
      jenisPestisida,
      bahanAktif,
      beratVolume: parseFloat(beratVolume),
      satuan,
      harga: parseFloat(harga),
    };

    setSubmitLoading(true);
    try {
      if (editingId) {
        await updatePestisida(editingId, pestisidaData);
        alert('Pestisida berhasil diperbarui!');
      } else {
        await createPestisida(pestisidaData);
        alert('Pestisida berhasil ditambahkan!');
      }
      fetchPestisidas(); // Muat ulang data
      // Reset form
      setNamaDagang('');
      setJenisPestisida('Fungisida');
      setBahanAktif('');
      setBeratVolume('');
      setSatuan('Gram');
      setHarga('');
      setEditingId(null);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan data pestisida.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (pestisida) => {
    setNamaDagang(pestisida.namaDagang);
    setJenisPestisida(pestisida.jenisPestisida);
    setBahanAktif(pestisida.bahanAktif);
    setBeratVolume(pestisida.beratVolume.toString());
    setSatuan(pestisida.satuan);
    setHarga(pestisida.harga.toString());
    setEditingId(pestisida._id);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pestisida ini?')) {
      setError(null);
      setLoading(true);
      try {
        await deletePestisida(id);
        alert('Pestisida berhasil dihapus!');
        fetchPestisidas();
        if (editingId === id) {
          setEditingId(null);
          setNamaDagang('');
          setJenisPestisida('Fungisida');
          setBahanAktif('');
          setBeratVolume('');
          setSatuan('Gram');
          setHarga('');
        }
      } catch (err) {
        setError(err.message || 'Terjadi kesalahan saat menghapus data pestisida.');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setNamaDagang('');
    setJenisPestisida('Fungisida');
    setBahanAktif('');
    setBeratVolume('');
    setSatuan('Gram');
    setHarga('');
    setEditingId(null);
    setError(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Master Data: Pestisida
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading && <CircularProgress sx={{ display: 'block', margin: 'auto', mb: 2 }} />}

      {/* Form Input Pestisida */}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4, maxWidth: 400 }}>
        <TextField
          label="Nama Dagang"
          variant="outlined"
          fullWidth
          value={namaDagang}
          onChange={(e) => setNamaDagang(e.target.value)}
          required
        />
        <FormControl fullWidth variant="outlined" required>
          <InputLabel>Jenis Pestisida</InputLabel>
          <Select
            value={jenisPestisida}
            onChange={(e) => setJenisPestisida(e.target.value)}
            label="Jenis Pestisida"
          >
            {jenisPestisidaOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Bahan Aktif"
          variant="outlined"
          fullWidth
          value={bahanAktif}
          onChange={(e) => setBahanAktif(e.target.value)}
          required
        />
        <TextField
          label="Berat/Volume"
          variant="outlined"
          fullWidth
          type="number"
          value={beratVolume}
          onChange={(e) => setBeratVolume(e.target.value)}
          required
          inputProps={{ min: 0 }}
        />
        <FormControl fullWidth variant="outlined" required>
          <InputLabel>Satuan</InputLabel>
          <Select
            value={satuan}
            onChange={(e) => setSatuan(e.target.value)}
            label="Satuan"
          >
            {satuanOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
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
            {submitLoading ? <CircularProgress size={24} color="inherit" /> : (editingId ? 'Update Pestisida' : 'Tambah Pestisida')}
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
        Daftar Pestisida
      </Typography>

      {pestisidas.length === 0 && !loading ? (
        <Typography>Belum ada pestisida yang ditambahkan.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="pestisida table">
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Nama Dagang</TableCell>
                <TableCell>Jenis</TableCell>
                <TableCell>Bahan Aktif</TableCell>
                <TableCell align="right">Berat/Volume</TableCell>
                <TableCell>Satuan</TableCell>
                <TableCell align="right">Harga</TableCell>
                <TableCell align="center">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pestisidas.map((pestisida, index) => (
                <TableRow key={pestisida._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{pestisida.namaDagang}</TableCell>
                  <TableCell>{pestisida.jenisPestisida}</TableCell>
                  <TableCell>{pestisida.bahanAktif}</TableCell>
                  <TableCell align="right">{pestisida.beratVolume}</TableCell>
                  <TableCell>{pestisida.satuan}</TableCell>
                  <TableCell align="right">Rp {pestisida.harga.toLocaleString('id-ID')}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="info"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(pestisida)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(pestisida._id)}
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

export default Pestisida;