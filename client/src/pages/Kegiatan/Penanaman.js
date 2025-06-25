// client/src/pages/Kegiatan/Penanaman.js
import React, { useState, useEffect } from 'react';
// Import SEMUA fungsi CRUD dari service
import { getPenanamans, createPenanaman, updatePenanaman, deletePenanaman } from '../../services/penanamanService';
import { getLahans } from '../../services/lahanService';
import { getBenihs } from '../../services/benihService';
import { getKebutuhans } from '../../services/kebutuhanService';

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


function Penanaman() {
  const [kegiatans, setKegiatans] = useState([]);
  const [lahans, setLahans] = useState([]);
  const [benihs, setBenihs] = useState([]);
  const [kebutuhans, setKebutuhans] = useState([]);

  const [selectedLahan, setSelectedLahan] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [benihDigunakan, setBenihDigunakan] = useState([{ benih: '', jumlah: '' }]);
  const [kebutuhanDigunakan, setKebutuhanDigunakan] = useState([{ kebutuhan: '', jumlah: '' }]);
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
      const responseData = await getPenanamans(); // <--- PANGGIL DARI SERVICE
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
        // PANGGIL getPenanamans DARI SERVICE
        const kegiatanResponse = await getPenanamans(); // <--- PANGGIL DARI SERVICE
        setKegiatans(kegiatanResponse.data); // Mengambil data dari properti 'data'

        // Panggil service untuk Master Data (mereka juga harus menggunakan axios 'api' instance)
        const [lahanData, benihData, kebutuhanData] = await Promise.all([
          getLahans(),
          getBenihs(),
          getKebutuhans(),
        ]);
        setLahans(lahanData);
        setBenihs(benihData);
        setKebutuhans(kebutuhanData);
      } catch (err) {
        setError(err.message || 'Terjadi kesalahan saat memuat data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Dependensi kosong agar hanya berjalan sekali saat mount

  // --- Handle Dynamic Inputs ---
  const handleAddBenih = () => setBenihDigunakan([...benihDigunakan, { benih: '', jumlah: '' }]);
  const handleRemoveBenih = (index) => {
    const list = [...benihDigunakan];
    list.splice(index, 1);
    setBenihDigunakan(list);
  };
  const handleBenihChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...benihDigunakan];
    list[index][name] = value;
    setBenihDigunakan(list);
  };

  const handleAddKebutuhan = () => setKebutuhanDigunakan([...kebutuhanDigunakan, { kebutuhan: '', jumlah: '' }]);
  const handleRemoveKebutuhan = (index) => {
    const list = [...kebutuhanDigunakan];
    list.splice(index, 1);
    setKebutuhanDigunakan(list);
  };
  const handleKebutuhanChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...kebutuhanDigunakan];
    list[index][name] = value;
    setKebutuhanDigunakan(list);
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
    setBenihDigunakan([{ benih: '', jumlah: '' }]);
    setKebutuhanDigunakan([{ kebutuhan: '', jumlah: '' }]);
    setPekerja([{ nama: '', biaya: '' }]);
    setEditingId(null);
    setError(null);
  };

  // --- Submit Form ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedLahan || !tanggal) {
      setError('Lahan dan Tanggal penanaman harus diisi!');
      return;
    }

    const kegiatanData = {
      lahan: selectedLahan,
      tanggal: tanggal,
      deskripsi: deskripsi,
      benihDigunakan: benihDigunakan.filter(item => item.benih && item.jumlah),
      kebutuhanDigunakan: kebutuhanDigunakan.filter(item => item.kebutuhan && item.jumlah),
      pekerja: pekerja.filter(item => item.nama && item.biaya),
    };

    setSubmitLoading(true);
    try {
      if (editingId) {
        await updatePenanaman(editingId, kegiatanData); // <--- Menggunakan fungsi service
        alert('Data penanaman berhasil diperbarui!');
      } else {
        await createPenanaman(kegiatanData); // <--- Menggunakan fungsi service
        alert('Data penanaman berhasil ditambahkan!');
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

    setBenihDigunakan(kegiatan.benihDigunakan.length > 0 ? kegiatan.benihDigunakan.map(item => ({
      benih: item.benih?._id || '',
      jumlah: item.jumlah,
    })) : [{ benih: '', jumlah: '' }]);

    setKebutuhanDigunakan(kegiatan.kebutuhanDigunakan.length > 0 ? kegiatan.kebutuhanDigunakan.map(item => ({
      kebutuhan: item.kebutuhan?._id || '',
      jumlah: item.jumlah,
    })) : [{ kebutuhan: '', jumlah: '' }]);

    setPekerja(kegiatan.pekerja.length > 0 ? kegiatan.pekerja.map(p => ({
      nama: p.nama,
      biaya: p.biaya,
    })) : [{ nama: '', biaya: '' }]);

    setEditingId(kegiatan._id);
    setError(null);
  };

  // --- Delete Function ---
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kegiatan penanaman ini?')) {
      setError(null);
      setLoading(true);
      try {
        await deletePenanaman(id); // <--- Menggunakan fungsi service
        alert('Kegiatan penanaman berhasil dihapus!');
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
        Kegiatan: Penanaman
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading && <CircularProgress sx={{ display: 'block', margin: 'auto', mb: 2 }} />}

      {/* Form Input Penanaman */}
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
          label="Tanggal Penanaman"
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
          placeholder="Contoh: Penanaman bibit tomat"
        />

        {/* Benih Digunakan (Multi-item) */}
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Benih Digunakan:</Typography>
        {benihDigunakan.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
            <FormControl fullWidth variant="outlined" sx={{ flexGrow: 2 }}>
              <InputLabel>Benih</InputLabel>
              <Select
                name="benih"
                value={item.benih}
                onChange={(e) => handleBenihChange(e, index)}
                label="Benih"
                required={!!item.jumlah || (benihDigunakan.length === 1 && benihDigunakan[0].jumlah !== '' && benihDigunakan[0].benih === '')}
              >
                <MenuItem value="">Pilih Benih</MenuItem>
                {benihs.map((b) => (
                  <MenuItem key={b._id} value={b._id}>
                    {b.nama} ({b.satuan}) - Rp {b.harga.toLocaleString('id-ID')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="jumlah"
              label="Jumlah"
              variant="outlined"
              type="number"
              value={item.jumlah}
              onChange={(e) => handleBenihChange(e, index)}
              placeholder="Jumlah"
              inputProps={{ min: 0 }}
              sx={{ flexGrow: 1 }}
              required={!!item.benih || (benihDigunakan.length === 1 && benihDigunakan[0].benih !== '' && benihDigunakan[0].jumlah === '')}
            />
            {benihDigunakan.length > 1 && (
              <IconButton color="error" onClick={() => handleRemoveBenih(index)}>
                <RemoveCircleOutlineIcon />
              </IconButton>
            )}
          </Box>
        ))}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddBenih}
          sx={{ alignSelf: 'flex-start' }}
        >
          Tambah Benih
        </Button>

        {/* Kebutuhan Digunakan (Multi-item) */}
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Kebutuhan Digunakan:</Typography>
        {kebutuhanDigunakan.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
            <FormControl fullWidth variant="outlined" sx={{ flexGrow: 2 }}>
              <InputLabel>Kebutuhan</InputLabel>
              <Select
                name="kebutuhan"
                value={item.kebutuhan}
                onChange={(e) => handleKebutuhanChange(e, index)}
                label="Kebutuhan"
                required={!!item.jumlah || (kebutuhanDigunakan.length === 1 && kebutuhanDigunakan[0].jumlah !== '' && kebutuhanDigunakan[0].kebutuhan === '')}
              >
                <MenuItem value="">Pilih Kebutuhan</MenuItem>
                {kebutuhans.map((k) => (
                  <MenuItem key={k._id} value={k._id}>
                    {k.nama} ({k.satuan}) - Rp {k.harga.toLocaleString('id-ID')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="jumlah"
              label="Jumlah"
              variant="outlined"
              type="number"
              value={item.jumlah}
              onChange={(e) => handleKebutuhanChange(e, index)}
              placeholder="Jumlah"
              inputProps={{ min: 0 }}
              sx={{ flexGrow: 1 }}
              required={!!item.kebutuhan || (kebutuhanDigunakan.length === 1 && kebutuhanDigunakan[0].kebutuhan !== '' && kebutuhanDigunakan[0].jumlah === '')}
            />
            {kebutuhanDigunakan.length > 1 && (
              <IconButton color="error" onClick={() => handleRemoveKebutuhan(index)}>
                <RemoveCircleOutlineIcon />
              </IconButton>
            )}
          </Box>
        ))}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddKebutuhan}
          sx={{ alignSelf: 'flex-start' }}
        >
          Tambah Kebutuhan
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
        Daftar Kegiatan Penanaman
      </Typography>

      {kegiatans.length === 0 && !loading ? (
        <Typography>Belum ada kegiatan penanaman yang ditambahkan.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="penanaman table">
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Lahan</TableCell>
                <TableCell>Tanggal</TableCell>
                <TableCell>Deskripsi</TableCell>
                <TableCell>Benih</TableCell>
                <TableCell>Kebutuhan</TableCell>
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
                    {kegiatan.benihDigunakan.length > 0 ? (
                      <List dense disablePadding>
                        {kegiatan.benihDigunakan.map((item, i) => (
                          <ListItem key={i} disablePadding>
                            <ListItemText primary={item.benih ? `${item.benih.nama} (${item.jumlah} ${item.benih.satuan})` : 'N/A'} />
                          </ListItem>
                        ))}
                      </List>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    {kegiatan.kebutuhanDigunakan.length > 0 ? (
                      <List dense disablePadding>
                        {kegiatan.kebutuhanDigunakan.map((item, i) => (
                          <ListItem key={i} disablePadding>
                            <ListItemText primary={item.kebutuhan ? `${item.kebutuhan.nama} (${item.jumlah} ${item.kebutuhan.satuan})` : 'N/A'} />
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

export default Penanaman;