// client/src/pages/Kegiatan/PerawatanTanaman.js
import React, { useState, useEffect } from 'react';
// Import SEMUA fungsi CRUD dari service
import { getPerawatanTanamans, createPerawatanTanaman, updatePerawatanTanaman, deletePerawatanTanaman } from '../../services/perawatanTanamanService';
import { getLahans } from '../../services/lahanService';
import { getPupuks } from '../../services/pupukService';
import { getPestisidas } from '../../services/pestisidaService';
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


function PerawatanTanaman() {
  const [kegiatans, setKegiatans] = useState([]);
  const [lahans, setLahans] = useState([]);
  const [pupuks, setPupuks] = useState([]);
  const [pestisidas, setPestisidas] = useState([]);
  const [kebutuhans, setKebutuhans] = useState([]);

  const [selectedLahan, setSelectedLahan] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [pupukDigunakan, setPupukDigunakan] = useState([{ pupuk: '', jumlah: '' }]);
  const [kebutuhanDigunakan, setKebutuhanDigunakan] = useState([{ kebutuhan: '', jumlah: '' }]);
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
      const responseData = await getPerawatanTanamans(); // <--- PANGGIL DARI SERVICE
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
        // PANGGIL getPerawatanTanamans DARI SERVICE
        const kegiatanResponse = await getPerawatanTanamans(); // <--- PANGGIL DARI SERVICE
        setKegiatans(kegiatanResponse.data); // Mengambil data dari properti 'data'

        // Panggil service untuk Master Data
        const [lahanData, pupukData, pestisidaData, kebutuhanData] = await Promise.all([
          getLahans(),
          getPupuks(),
          getPestisidas(),
          getKebutuhans(),
        ]);
        setLahans(lahanData);
        setPupuks(pupukData);
        setPestisidas(pestisidaData);
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
  const handleAddPupuk = () => setPupukDigunakan([...pupukDigunakan, { pupuk: '', jumlah: '' }]);
  const handleRemovePupuk = (index) => {
    const list = [...pupukDigunakan];
    list.splice(index, 1);
    setPupukDigunakan(list);
  };
  const handlePupukChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...pupukDigunakan];
    list[index][name] = value;
    setPupukDigunakan(list);
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
    setPupukDigunakan([{ pupuk: '', jumlah: '' }]);
    setKebutuhanDigunakan([{ kebutuhan: '', jumlah: '' }]);
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
      pupukDigunakan: pupukDigunakan.filter(item => item.pupuk && item.jumlah),
      kebutuhanDigunakan: kebutuhanDigunakan.filter(item => item.kebutuhan && item.jumlah),
      pestisidaDigunakan: pestisidaDigunakan.filter(item => item.pestisida && item.jumlah),
      pekerja: pekerja.filter(item => item.nama && item.biaya),
    };

    setSubmitLoading(true);
    try {
      if (editingId) {
        await updatePerawatanTanaman(editingId, kegiatanData); // Menggunakan fungsi service
        alert('Data perawatan tanaman berhasil diperbarui!');
      } else {
        await createPerawatanTanaman(kegiatanData); // Menggunakan fungsi service
        alert('Data perawatan tanaman berhasil ditambahkan!');
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

    setPupukDigunakan(kegiatan.pupukDigunakan.length > 0 ? kegiatan.pupukDigunakan.map(item => ({
      pupuk: item.pupuk?._id || '',
      jumlah: item.jumlah,
    })) : [{ pupuk: '', jumlah: '' }]);

    setKebutuhanDigunakan(kegiatan.kebutuhanDigunakan.length > 0 ? kegiatan.kebutuhanDigunakan.map(item => ({
      kebutuhan: item.kebutuhan?._id || '',
      jumlah: item.jumlah,
    })) : [{ kebutuhan: '', jumlah: '' }]);

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
    if (window.confirm('Apakah Anda yakin ingin menghapus kegiatan perawatan tanaman ini?')) {
      setError(null);
      setLoading(true);
      try {
        await deletePerawatanTanaman(id); // Menggunakan fungsi service
        alert('Kegiatan perawatan tanaman berhasil dihapus!');
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
        Kegiatan: Perawatan Tanaman
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading && <CircularProgress sx={{ display: 'block', margin: 'auto', mb: 2 }} />}

      {/* Form Input Perawatan Tanaman */}
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
          label="Deskripsi Kegiatan"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          placeholder="Contoh: Pemupukan, penyiangan gulma, penyiraman"
        />

        {/* Pupuk Digunakan (Opsional, Multi-item) */}
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Pupuk Digunakan (Opsional):</Typography>
        {pupukDigunakan.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
            <FormControl fullWidth variant="outlined" sx={{ flexGrow: 2 }}>
              <InputLabel>Pupuk</InputLabel>
              <Select
                name="pupuk"
                value={item.pupuk}
                onChange={(e) => handlePupukChange(e, index)}
                label="Pupuk"
              >
                <MenuItem value="">Pilih Pupuk</MenuItem>
                {pupuks.map((p) => (
                  <MenuItem key={p._id} value={p._id}>
                    {p.nama} ({p.satuan}) - Rp {p.harga.toLocaleString('id-ID')}
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
              onChange={(e) => handlePupukChange(e, index)}
              placeholder="Jumlah"
              inputProps={{ min: 0 }}
              sx={{ flexGrow: 1 }}
            />
            {pupukDigunakan.length > 1 && (
              <IconButton color="error" onClick={() => handleRemovePupuk(index)}>
                <RemoveCircleOutlineIcon />
              </IconButton>
            )}
          </Box>
        ))}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddPupuk}
          sx={{ alignSelf: 'flex-start' }}
        >
          Tambah Pupuk
        </Button>

        {/* Kebutuhan Digunakan (Opsional, Multi-item) */}
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Kebutuhan Digunakan (Opsional):</Typography>
        {kebutuhanDigunakan.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
            <FormControl fullWidth variant="outlined" sx={{ flexGrow: 2 }}>
              <InputLabel>Kebutuhan</InputLabel>
              <Select
                name="kebutuhan"
                value={item.kebutuhan}
                onChange={(e) => handleKebutuhanChange(e, index)}
                label="Kebutuhan"
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

        {/* Pestisida Digunakan (Opsional, Multi-item) */}
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Pestisida Digunakan (Opsional):</Typography>
        {pestisidaDigunakan.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
            <FormControl fullWidth variant="outlined" sx={{ flexGrow: 2 }}>
              <InputLabel>Pestisida</InputLabel>
              <Select
                name="pestisida"
                value={item.pestisida}
                onChange={(e) => handlePestisidaChange(e, index)}
                label="Pestisida"
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
        Daftar Kegiatan Perawatan Tanaman
      </Typography>

      {kegiatans.length === 0 && !loading ? (
        <Typography>Belum ada kegiatan perawatan tanaman yang ditambahkan.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="perawatan tanaman table">
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Lahan</TableCell>
                <TableCell>Tanggal</TableCell>
                <TableCell>Deskripsi</TableCell>
                <TableCell>Pupuk</TableCell>
                <TableCell>Kebutuhan</TableCell>
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
                    {kegiatan.pupukDigunakan.length > 0 ? (
                      <List dense disablePadding>
                        {kegiatan.pupukDigunakan.map((item, i) => (
                          <ListItem key={i} disablePadding>
                            <ListItemText primary={item.pupuk ? `${item.pupuk.nama} (${item.jumlah} ${item.pupuk.satuan})` : 'N/A'} />
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

export default PerawatanTanaman;