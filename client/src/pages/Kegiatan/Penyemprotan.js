// client/src/pages/Kegiatan/Penyemprotan.js
import React, { useState, useEffect } from 'react';
// Import SEMUA fungsi CRUD dari service
import { getPenyemprotans, createPenyemprotan, updatePenyemprotan, deletePenyemprotan } from '../../services/penyemprotanService';
import { getLahans } from '../../services/lahanService';
import { getPestisidas } from '../../services/pestisidaService';

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
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

// Import ikon Material-UI
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';


function Penyemprotan() {
  const [kegiatans, setKegiatans] = useState([]);
  const [lahans, setLahans] = useState([]);
  const [pestisidas, setPestisidas] = useState([]);

  const [selectedLahan, setSelectedLahan] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [pestisidaDigunakan, setPestisidaDigunakan] = useState([{ pestisida: '', jumlah: '' }]);
  const [pekerja, setPekerja] = useState([{ nama: '', biaya: '' }]);

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fungsi untuk memuat ulang data kegiatan setelah CUD
  const fetchKegiatans = async () => {
    setLoading(true);
    setError(null);
    try {
      const responseData = await getPenyemprotans(); // <--- PANGGIL DARI SERVICE
      setKegiatans(responseData.data); // Mengambil data dari properti 'data'
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memuat data kegiatan.');
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch Master Data and Kegiatan Data (Initial Load) ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // PANGGIL getPenyemprotans DARI SERVICE
        const kegiatanResponse = await getPenyemprotans(); // <--- PANGGIL DARI SERVICE
        setKegiatans(kegiatanResponse.data); // Mengambil data dari properti 'data'

        // Panggil service untuk Master Data
        const [lahanData, pestisidaData] = await Promise.all([
          getLahans(),
          getPestisidas(),
        ]);
        setLahans(lahanData);
        setPestisidas(pestisidaData);
      } catch (err) {
        setError(err.message || 'Terjadi kesalahan saat memuat data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Handle Dynamic Inputs ---
  const handleAddPestisida = () => setPestisidaDigunakan([...pestisidaDigunakan, { pestisida: '', jumlah: '' }]);
  const handleRemovePestisida = (index) => {
    const list = [...pestisidaDigunakan];
    list.splice(index, 1);
    setPestisidaDigunakan(list);
  };
  const handlePestisidaChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...pestisidaDigunakan];
    list[index][name] = value;
    setPestisidaDigunakan(list);
  };

  const handleAddPekerja = () => setPekerja([...pekerja, { nama: '', biaya: '' }]);
  const handleRemovePekerja = (index) => {
    const list = [...pekerja];
    list.splice(index, 1);
    setPekerja(list);
  };
  const handlePekerjaChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...pekerja];
    list[index][name] = value;
    setPekerja(list);
  };

  // --- Reset Form Fields ---
  const resetForm = () => {
    setSelectedLahan('');
    setTanggal('');
    setDeskripsi('');
    setPestisidaDigunakan([{ pestisida: '', jumlah: '' }]);
    setPekerja([{ nama: '', biaya: '' }]);
    setEditingId(null);
    setError(null);
  };

  // --- Submit Form ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedLahan || !tanggal) {
      setError('Lahan dan Tanggal kegiatan harus diisi!');
      return;
    }

    const kegiatanData = {
      lahan: selectedLahan,
      tanggal: tanggal,
      deskripsi: deskripsi,
      pestisidaDigunakan: pestisidaDigunakan.filter(item => item.pestisida && item.jumlah),
      pekerja: pekerja.filter(item => item.nama && item.biaya),
    };

    setSubmitLoading(true);
    try {
      if (editingId) {
        await updatePenyemprotan(editingId, kegiatanData); // Menggunakan fungsi service
        alert('Data penyemprotan berhasil diperbarui!');
      } else {
        await createPenyemprotan(kegiatanData); // Menggunakan fungsi service
        alert('Data penyemprotan berhasil ditambahkan!');
      }
      fetchKegiatans(); // Muat ulang data kegiatan setelah operasi
      resetForm();
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // --- Edit Function ---
  const handleEdit = (kegiatan) => {
    setSelectedLahan(kegiatan.lahan?._id || '');
    setTanggal(new Date(kegiatan.tanggal).toISOString().split('T')[0]);
    setDeskripsi(kegiatan.deskripsi);

    setPestisidaDigunakan(kegiatan.pestisidaDigunakan.length > 0 ? kegiatan.pestisidaDigunakan.map(item => ({
      pestisida: item.pestisida?._id || '',
      jumlah: item.jumlah,
    })) : [{ pestisida: '', jumlah: '' }]);

    setPekerja(kegiatan.pekerja.length > 0 ? kegiatan.pekerja.map(p => ({
      nama: p.nama,
      biaya: p.biaya,
    })) : [{ nama: '', biaya: '' }]);

    setEditingId(kegiatan._id);
    setError(null);
  };

  // --- Delete Function ---
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kegiatan penyemprotan ini?')) {
      setError(null);
      setLoading(true);
      try {
        await deletePenyemprotan(id); // Menggunakan fungsi service
        alert('Kegiatan penyemprotan berhasil dihapus!');
        fetchKegiatans();
        if (editingId === id) {
          resetForm();
        }
      } catch (err) {
        setError(err.message || 'Terjadi kesalahan saat menghapus data.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Kegiatan: Penyemprotan
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading && <CircularProgress sx={{ display: 'block', margin: 'auto', mb: 2 }} />}

      {/* Form Input Penyemprotan */}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4, maxWidth: 800 }}>
        <FormControl fullWidth variant="outlined" required>
          <InputLabel>Lahan</InputLabel>
          <Select
            value={selectedLahan}
            onChange={(e) => setSelectedLahan(e.target.value)}
            label="Lahan"
          >
            <MenuItem value="">Pilih Lahan</MenuItem>
            {lahans.map((lahan) => (
              <MenuItem key={lahan._id} value={lahan._id}>
                {lahan.nama} ({lahan.luas} m²)
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Tanggal"
          variant="outlined"
          fullWidth
          type="date"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          required
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Deskripsi"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          placeholder="Contoh: Penyemprotan insektisida untuk hama"
        />

        {/* Pestisida Digunakan (Multi-item) */}
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Pestisida Digunakan:</Typography>
        {pestisidaDigunakan.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
            <FormControl fullWidth variant="outlined" sx={{ flexGrow: 2 }}>
              <InputLabel>Pestisida</InputLabel>
              <Select
                name="pestisida"
                value={item.pestisida}
                onChange={(e) => handlePestisidaChange(e, index)}
                label="Pestisida"
                required={!!item.jumlah || (pestisidaDigunakan.length === 1 && pestisidaDigunakan[0].jumlah !== '' && pestisidaDigunakan[0].pestisida === '')}
              >
                <MenuItem value="">Pilih Pestisida</MenuItem>
                {pestisidas.map((p) => (
                  <MenuItem key={p._id} value={p._id}>
                    {p.namaDagang} ({p.beratVolume} {p.satuan}) - Rp {p.harga.toLocaleString('id-ID')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="jumlah"
              label="Jumlah (Gram/Ml)"
              variant="outlined"
              type="number"
              value={item.jumlah}
              onChange={(e) => handlePestisidaChange(e, index)}
              placeholder="Jumlah"
              inputProps={{ min: 0 }}
              sx={{ flexGrow: 1 }}
              required={!!item.pestisida || (pestisidaDigunakan.length === 1 && pestisidaDigunakan[0].pestisida !== '' && pestisidaDigunakan[0].jumlah === '')}
            />
            {pestisidaDigunakan.length > 1 && (
              <IconButton color="error" onClick={() => handleRemovePestisida(index)}>
                <RemoveCircleOutlineIcon />
              </IconButton>
            )}
          </Box>
        ))}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddPestisida}
          sx={{ alignSelf: 'flex-start' }}
        >
          Tambah Pestisida
        </Button>

        {/* Pekerja & Biaya (Multi-item) */}
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Pekerja & Biaya:</Typography>
        {pekerja.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
            <TextField
              name="nama"
              label="Nama Pekerja"
              variant="outlined"
              fullWidth
              value={item.nama}
              onChange={(e) => handlePekerjaChange(e, index)}
              required={pekerja.length === 1}
              sx={{ flexGrow: 1.5 }}
            />
            <TextField
              name="biaya"
              label="Biaya"
              variant="outlined"
              type="number"
              value={item.biaya}
              onChange={(e) => handlePekerjaChange(e, index)}
              required={pekerja.length === 1}
              inputProps={{ min: 0 }}
              sx={{ flexGrow: 1 }}
            />
            {pekerja.length > 1 && (
              <IconButton color="error" onClick={() => handleRemovePekerja(index)}>
                <RemoveCircleOutlineIcon />
              </IconButton>
            )}
          </Box>
        ))}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddPekerja}
          sx={{ alignSelf: 'flex-start' }}
        >
          Tambah Pekerja
        </Button>


        <Box sx={{ mt: 3, display: 'flex', gap: 1, justifyContent: 'flex-start' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={editingId ? <EditIcon /> : <AddIcon />}
            disabled={submitLoading}
          >
            {submitLoading ? <CircularProgress size={24} color="inherit" /> : (editingId ? 'Update Kegiatan' : 'Tambah Kegiatan')}
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
        Daftar Kegiatan Penyemprotan
      </Typography>

      {kegiatans.length === 0 && !loading ? (
        <Typography>Belum ada kegiatan penyemprotan yang ditambahkan.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="penyemprotan table">
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Lahan</TableCell>
                <TableCell>Tanggal</TableCell>
                <TableCell>Deskripsi</TableCell>
                <TableCell>Pestisida</TableCell>
                <TableCell>Pekerja</TableCell>
                <TableCell align="right">Total Biaya</TableCell>
                <TableCell align="center">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {kegiatans.map((kegiatan, index) => (
                <TableRow key={kegiatan._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{kegiatan.lahan ? kegiatan.lahan.nama : 'N/A'}</TableCell>
                  <TableCell>{new Date(kegiatan.tanggal).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>{kegiatan.deskripsi || '-'}</TableCell>
                  <TableCell>
                    {kegiatan.pestisidaDigunakan.length > 0 ? (
                      <List dense disablePadding>
                        {kegiatan.pestisidaDigunakan.map((item, i) => (
                          <ListItem key={i} disablePadding>
                            <ListItemText primary={item.pestisida ? `${item.pestisida.namaDagang} (${item.jumlah} ${item.pestisida.satuan})` : 'N/A'} />
                          </ListItem>
                        ))}
                      </List>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    {kegiatan.pekerja.length > 0 ? (
                      <List dense disablePadding>
                        {kegiatan.pekerja.map((p, i) => (
                          <ListItem key={i} disablePadding>
                            <ListItemText primary={`${p.nama} (Rp ${p.biaya.toLocaleString('id-ID')})`} />
                          </ListItem>
                        ))}
                      </List>
                    ) : '-'}
                  </TableCell>
                  <TableCell align="right">Rp {kegiatan.totalBiaya.toLocaleString('id-ID')}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="info"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(kegiatan)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(kegiatan._id)}
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

export default Penyemprotan;