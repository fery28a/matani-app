// client/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react'; // <--- KOREKSI: '=>' diubah menjadi 'from'
import { getLatestSprayHistory, getTotalCostsPerLahan } from '../services/dashboardService';
import { getUserInfo } from '../services/authService'; // Untuk menampilkan nama user

// Import komponen Material-UI
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,        // Untuk layout responsif
  Paper,       // Untuk tampilan seperti kartu
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

// Import ikon Material-UI
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'; // Untuk riwayat
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';       // Untuk biaya

function Dashboard() {
  const [latestSpray, setLatestSpray] = useState([]);
  const [totalCostsPerLahan, setTotalCostsPerLahan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userInfo = getUserInfo(); // Ambil info user

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [sprayData, costsData] = await Promise.all([
          getLatestSprayHistory(),
          getTotalCostsPerLahan(),
        ]);
        
        console.log("Dashboard Frontend: Fetched Spray Data:", sprayData); // Debugging log
        console.log("Dashboard Frontend: Fetched Costs Data:", costsData); // Debugging log

        setLatestSpray(sprayData);
        setTotalCostsPerLahan(costsData);
      } catch (err) {
        console.error("Dashboard Frontend Error: fetchDashboardData:", err);
        setError(err.message || "Gagal memuat data dashboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Selamat datang, {userInfo?.username || 'Pengguna'}!
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Ringkasan kegiatan pertanian Anda.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 5 }} />
      ) : (
        <Grid container spacing={3}>
          {/* Riwayat Penyemprotan Terakhir */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTimeFilledIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" component="h2">
                  Riwayat Penyemprotan Terakhir
                </Typography>
              </Box>
              {latestSpray.length === 0 ? (
                <Typography variant="body2" color="text.secondary">Belum ada riwayat penyemprotan.</Typography>
              ) : (
                <List dense>
                  {latestSpray.map((spray, index) => (
                    <ListItem key={spray._id} disablePadding sx={{ mb: 1 }}>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {spray.lahan ? spray.lahan.nama : 'N/A'} - {new Date(spray.tanggal).toLocaleDateString('id-ID')}
                          </Typography>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography sx={{ display: 'block' }} component="span" variant="body2" color="text.secondary">
                              {/* Tampilkan detail pestisida */}
                              {spray.pestisidaDigunakan && spray.pestisidaDigunakan.length > 0 ? (
                                spray.pestisidaDigunakan.map((item, i) => (
                                  <span key={i}>
                                    {item.pestisida ? `${item.pestisida.namaDagang} (${item.jumlah} ${item.pestisida.satuan})` : 'N/A'}
                                    {i < spray.pestisidaDigunakan.length - 1 ? '; ' : ''}
                                  </span>
                                ))
                              ) : 'Tidak ada pestisida'}
                            </Typography>
                            <Typography variant="body2" color="text.primary" sx={{ mt: 0.5 }}>
                              Total Biaya: Rp {spray.totalBiaya.toLocaleString('id-ID')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {spray.deskripsi || 'Tidak ada deskripsi'}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>

          {/* Total Biaya Kegiatan per Lahan */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoneyIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h5" component="h2">
                  Total Biaya Kegiatan per Lahan
                </Typography>
              </Box>
              {totalCostsPerLahan.length === 0 ? (
                <Typography variant="body2" color="text.secondary">Belum ada data biaya per lahan.</Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Lahan</TableCell>
                        <TableCell align="right">Luas (m²)</TableCell>
                        <TableCell align="right">Total Biaya</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {totalCostsPerLahan.map((data, index) => (
                        <TableRow key={data.lahan._id}>
                          <TableCell component="th" scope="row">
                            {data.lahan ? data.lahan.nama : 'N/A'}
                          </TableCell>
                          <TableCell align="right">{data.lahan ? data.lahan.luas : 'N/A'}</TableCell>
                          <TableCell align="right">Rp {data.totalBiayaSemuaKegiatan.toLocaleString('id-ID')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default Dashboard;