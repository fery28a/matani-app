// client/src/pages/MasterData/Lahan.js
import React, { useState, useEffect } from 'react';
import { getLahans, createLahan, updateLahan, deleteLahan, resetLahan } from '../../services/lahanService';

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

// Import ikon Material-UI (pastikan nama ikon yang benar)
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestartAltIcon from '@mui/icons-material/RestartAlt'; // <-- KOREKSI: ini ikon untuk Reset
import AddIcon from '@mui/icons-material/Add';           // <-- Ini ikon untuk Add/Tambah

function Lahan() {
  const [lahans, setLahans] = useState([]);
  const [namaLahan, setNamaLahan] = useState('');
  const [luasLahan, setLuasLahan] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false); // Loading khusus untuk submit form

  // Fungsi untuk memuat data lahan dari API
  const fetchLahans = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLahans();
      setLahans(data);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memuat data.');
    } finally {
      setLoading(false);
    }
  };

  // Jalankan fetchLahans saat komponen pertama kali di-mount
  useEffect(() => {
    fetchLahans();
  }, []);

  // --- Fungsi untuk Menambah/Mengedit Lahan ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error
    if (!namaLahan || !luasLahan) {
      setError('Nama dan Luas Lahan harus diisi!');
      return;
    }

    const lahanData = {
      nama: namaLahan,
      luas: parseFloat(luasLahan)
    };

    setSubmitLoading(true); // Mulai loading saat submit
    try {
      if (editingId) {
        await updateLahan(editingId, lahanData);
        alert('Lahan berhasil diperbarui!');
      } else {
        await createLahan(lahanData);
        alert('Lahan berhasil ditambahkan!');
      }
      fetchLahans(); // Muat ulang data
      // Reset form
      setNamaLahan('');
      setLuasLahan('');
      setEditingId(null);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setSubmitLoading(false); // Hentikan loading
    }
  };

  // --- Fungsi untuk Mengedit Lahan (memuat data ke form) ---
  const handleEdit = (lahan) => {
    setNamaLahan(lahan.nama);
    setLuasLahan(lahan.luas.toString());
    setEditingId(lahan._id); // Pastikan menggunakan _id dari MongoDB
    setError(null);
  };

  // --- Fungsi untuk Menghapus Lahan ---
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus lahan ini?')) {
      setError(null);
      setLoading(true); // Gunakan loading utama untuk operasi table
      try {
        await deleteLahan(id);
        alert('Lahan berhasil dihapus!');
        fetchLahans(); // Muat ulang data
        if (editingId === id) {
          setEditingId(null);
          setNamaLahan('');
          setLuasLahan('');
        }
      } catch (err) {
        setError(err.message || 'Terjadi kesalahan saat menghapus data.');
      } finally {
        setLoading(false);
      }
    }
  };

  // --- Fungsi untuk Reset Lahan (Memanggil API Backend untuk Penghapusan Cascading) ---
  const handleReset = async (id) => {
    const lahanToReset = lahans.find(l => l._id === id); // Cari nama lahan untuk konfirmasi
    if (window.confirm(`PERINGATAN: Apakah Anda yakin ingin mereset Lahan "${lahanToReset?.nama || 'Ini'}"? Tindakan ini akan menghapus lahan dan SEMUA KEGIATAN terkaitnya (pengolahan, penanaman, perawatan, penyemprotan, panen) secara permanen!`)) {
      setError(null);
      setLoading(true); // Gunakan loading utama untuk operasi table
      try {
        await resetLahan(id); // Memanggil fungsi resetLahan dari service
        alert(`Lahan "${lahanToReset?.nama || 'Ini'}" dan semua data terkaitnya berhasil direset.`);
        fetchLahans(); // Muat ulang data lahan (data yang direset sudah terhapus)
        if (editingId === id) { // Jika lahan yang direset sedang diedit
          setEditingId(null);
          setNamaLahan('');
          setLuasLahan('');
        }
      } catch (err) {
        setError(err.message || 'Terjadi kesalahan saat mereset data lahan.');
      } finally {
        setLoading(false);
      }
    }
  };

  // --- Fungsi untuk Mereset Form (saat batal edit atau submit berhasil) ---
  const resetForm = () => { // <--- FUNGSI resetForm SEKARANG TERDEFINISI DI SINI
    setNamaLahan('');
    setLuasLahan('');
    setEditingId(null);
    setError(null);
  };

  return (
    <Box sx={{ p: 3 }}> {/* Box sebagai container utama dengan padding */}
      <Typography variant="h4" gutterBottom>
        Master Data: Lahan
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading && <CircularProgress sx={{ display: 'block', margin: 'auto', mb: 2 }} />}

      {/* Form Input Lahan */}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4, maxWidth: 400 }}>
        <TextField
          label="Nama Lahan"
          variant="outlined"
          fullWidth
          value={namaLahan}
          onChange={(e) => setNamaLahan(e.target.value)}
          required
        />
        <TextField
          label="Luas Lahan (m²)"
          variant="outlined"
          fullWidth
          type="number"
          value={luasLahan}
          onChange={(e) => setLuasLahan(e.target.value)}
          required
          inputProps={{ min: 0 }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={editingId ? <EditIcon /> : <AddIcon />}
            disabled={submitLoading} // Disable tombol saat loading submit
          >
            {submitLoading ? <CircularProgress size={24} color="inherit" /> : (editingId ? 'Update Lahan' : 'Tambah Lahan')}
          </Button>
          {editingId && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={resetForm} // <--- Memanggil resetForm yang sudah didefinisikan
              disabled={submitLoading}
            >
              Batal Edit
            </Button>
          )}
        </Box>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Daftar Lahan
      </Typography>

      {lahans.length === 0 && !loading ? (
        <Typography>Belum ada lahan yang ditambahkan.</Typography>
      ) : (
        <TableContainer component={Paper}> {/* Menggunakan Paper untuk efek elevasi */}
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Nama Lahan</TableCell>
                <TableCell align="right">Luas Lahan (m²)</TableCell>
                <TableCell align="center">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lahans.map((lahan, index) => (
                <TableRow key={lahan._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{lahan.nama}</TableCell>
                  <TableCell align="right">{lahan.luas}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="info"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(lahan)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(lahan._id)}
                      sx={{ mr: 1 }}
                    >
                      Hapus
                    </Button>
                    <Button
                      variant="outlined"
                      color="warning" // Warna peringatan
                      size="small"
                      startIcon={<RestartAltIcon />} // <-- KOREKSI IKON INI JUGA
                      onClick={() => handleReset(lahan._id)}
                    >
                      Reset
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

export default Lahan;