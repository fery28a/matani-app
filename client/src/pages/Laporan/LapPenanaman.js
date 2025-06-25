// client/src/pages/Laporan/LapPenanaman.js
import React, { useState, useEffect } from 'react';
import { getPenanamans } from '../../services/penanamanService'; // Panggil dari service yang sudah terintegrasi Axios
import { getLahans } from '../../services/lahanService';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

// Import komponen Material-UI
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

function LapPenanaman() {
  const [laporanData, setLaporanData] = useState([]);
  const [totalBiayaKeseluruhan, setTotalBiayaKeseluruhan] = useState(0);
  const [lahans, setLahans] = useState([]);
  const [selectedLahanId, setSelectedLahanId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const lahanList = await getLahans();
        setLahans(lahanList);
      } catch (err) {
        console.error("Error fetching master lahan:", err);
        setError(err.message || "Gagal memuat daftar lahan.");
      }
    };
    fetchMasterData();
  }, []);

  useEffect(() => {
    const fetchLaporan = async () => {
      setLoading(true);
      setError(null);
      try {
        // Panggil fungsi getPenanamans dari service, yang akan handle axios dan token
        const responseData = await getPenanamans(selectedLahanId); // Mengirim lahanId sebagai parameter
        
        // Data sudah diformat oleh service menjadi {data: [...], totalKeseluruhanBiaya: ...}
        setLaporanData(responseData.data);
        setTotalBiayaKeseluruhan(responseData.totalKeseluruhanBiaya);
      } catch (err) {
        setError(err.message || 'Terjadi kesalahan saat memuat laporan.');
      } finally {
        setLoading(false);
      }
    };

    fetchLaporan();
  }, [selectedLahanId]);

  const exportPdf = () => {
    const doc = new jsPDF('landscape');
    doc.text(`Laporan Penanaman ${selectedLahanId ? `(Lahan: ${lahans.find(l => l._id === selectedLahanId)?.nama})` : ''}`, 14, 20);

    const tableColumn = ["No.", "Lahan", "Tanggal", "Deskripsi", "Benih", "Kebutuhan", "Pekerja", "Total Biaya"];
    const tableRows = [];

    laporanData.forEach((kegiatan, index) => {
      const benihStr = kegiatan.benihDigunakan.map(item => `${item.benih?.nama || 'N/A'} (${item.jumlah} ${item.benih?.satuan || ''})`).join('\n');
      const kebutuhanStr = kegiatan.kebutuhanDigunakan.map(item => `${item.kebutuhan?.nama || 'N/A'} (${item.jumlah} ${item.kebutuhan?.satuan || ''})`).join('\n');
      const pekerjaStr = kegiatan.pekerja.map(p => `${p.nama} (Rp ${p.biaya.toLocaleString('id-ID')})`).join('\n');

      const rowData = [
        index + 1,
        kegiatan.lahan ? kegiatan.lahan.nama : 'N/A',
        new Date(kegiatan.tanggal).toLocaleDateString('id-ID'),
        kegiatan.deskripsi || '-',
        benihStr || '-',
        kebutuhanStr || '-',
        pekerjaStr || '-',
        `Rp ${kegiatan.totalBiaya.toLocaleString('id-ID')}`
      ];
      tableRows.push(rowData);
    });

    tableRows.push(["", "", "", "", "", "", { content: "Total Keseluruhan:", styles: { fontStyle: 'bold', halign: 'right' } }, `Rp ${totalBiayaKeseluruhan.toLocaleString('id-ID')}`]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 8, overflow: 'linebreak' },
      headStyles: { fillColor: [20, 100, 20] },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 35 },
        2: { cellWidth: 25 },
        3: { cellWidth: 45 },
        4: { cellWidth: 35 },
        5: { cellWidth: 35 },
        6: { cellWidth: 40 },
        7: { cellWidth: 25 }
      }
    });

    doc.save(`Laporan_Penanaman_${selectedLahanId ? lahans.find(l => l._id === selectedLahanId)?.nama : 'Semua'}.pdf`);
  };

  const exportCsv = () => {
    const header = ["No.", "Lahan", "Tanggal", "Deskripsi", "Benih", "Kebutuhan", "Pekerja", "Total Biaya"];
    const dataRows = laporanData.map((kegiatan, index) => {
      const benihStr = kegiatan.benihDigunakan.map(item => `${item.benih?.nama || 'N/A'} (${item.jumlah} ${item.benih?.satuan || ''})`).join('; ');
      const kebutuhanStr = kegiatan.kebutuhanDigunakan.map(item => `${item.kebutuhan?.nama || 'N/A'} (${item.jumlah} ${item.kebutuhan?.satuan || ''})`).join('; ');
      const pekerjaStr = kegiatan.pekerja.map(p => `${p.nama} (Rp ${p.biaya.toLocaleString('id-ID')})`).join('; ');

      return [
        index + 1,
        kegiatan.lahan ? kegiatan.lahan.nama : 'N/A',
        new Date(kegiatan.tanggal).toLocaleDateString('id-ID'),
        kegiatan.deskripsi || '-',
        benihStr || '-',
        kebutuhanStr || '-',
        pekerjaStr || '-',
        `Rp ${kegiatan.totalBiaya.toLocaleString('id-ID')}`
      ];
    });

    dataRows.push(["", "", "", "", "", "", "Total Keseluruhan:", `Rp ${totalBiayaKeseluruhan.toLocaleString('id-ID')}`]);

    const ws = XLSX.utils.aoa_to_sheet([header, ...dataRows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Penanaman");
    const wbout = XLSX.write(wb, { bookType: 'csv', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `Laporan_Penanaman_${selectedLahanId ? lahans.find(l => l._id === selectedLahanId)?.nama : 'Semua'}.csv`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Laporan Penanaman
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ mb: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel>Pilih Lahan</InputLabel>
          <Select
            value={selectedLahanId}
            onChange={(e) => setSelectedLahanId(e.target.value)}
            label="Pilih Lahan"
          >
            <MenuItem value="">Semua Lahan</MenuItem>
            {lahans.map((lahan) => (
              <MenuItem key={lahan._id} value={lahan._id}>
                {lahan.nama}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Button onClick={exportPdf} variant="contained" sx={{ mr: 1 }}>Export PDF</Button>
        <Button onClick={exportCsv} variant="outlined">Export CSV</Button>
      </Box>

      {loading ? (
        <CircularProgress sx={{ display: 'block', margin: 'auto', mb: 2 }} />
      ) : laporanData.length === 0 ? (
        <Typography>Tidak ada data penanaman untuk ditampilkan.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="laporan penanaman table">
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
              </TableRow>
            </TableHead>
            <TableBody>
              {laporanData.map((kegiatan, index) => (
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
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={7} align="right" sx={{ fontWeight: 'bold' }}>Total Biaya Keseluruhan:</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Rp {totalBiayaKeseluruhan.toLocaleString('id-ID')}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default LapPenanaman;