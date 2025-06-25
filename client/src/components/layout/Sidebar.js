// client/src/components/layout/Sidebar.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Import komponen Material-UI
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Box,
  Divider,
  Button // <--- Import Button
} from '@mui/material';

// Import ikon Material-UI
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ArticleIcon from '@mui/icons-material/Article';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import LogoutIcon from '@mui/icons-material/Logout'; // <--- Import LogoutIcon


// Ikon untuk sub-menu Master Data
import LandscapeIcon from '@mui/icons-material/Landscape';
import GrassIcon from '@mui/icons-material/Grass';
import ScienceIcon from '@mui/icons-material/Science';
import BugReportIcon from '@mui/icons-material/BugReport';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

// Ikon untuk kegiatan
import AgricultureIcon from '@mui/icons-material/Agriculture';
import SpaIcon from '@mui/icons-material/Spa';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ForestIcon from '@mui/icons-material/Forest';


// Lebar sidebar
const drawerWidth = 250;

function Sidebar({ onLogout }) { // <--- Terima prop onLogout
  const location = useLocation();
  const [openMasterData, setOpenMasterData] = useState(true);
  const [openKegiatan, setOpenKegiatan] = useState(true);
  const [openLaporan, setOpenLaporan] = useState(true);

  const handleClickMasterData = () => {
    setOpenMasterData(!openMasterData);
  };
  const handleClickKegiatan = () => {
    setOpenKegiatan(!openKegiatan);
  };
  const handleClickLaporan = () => {
    setOpenLaporan(!openLaporan);
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#2c3e50',
          color: 'white',
          '& .Mui-selected': {
            backgroundColor: '#1a7566 !important',
            color: 'white',
            '& .MuiListItemIcon-root': {
              color: 'white',
            },
          },
          '& .MuiListItemButton-root:not(.Mui-selected):hover': {
            backgroundColor: '#34495e',
          },
        },
      }}
      variant="permanent"
      anchor="left"
    >
      {/* Header sidebar: Logo dan Slogan */}
      <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#243444', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 0.5 }}>
          <LocalFloristIcon sx={{ color: '#64DD17', fontSize: '2.5rem', marginRight: 1 }} />
          <Typography
            variant="h3"
            sx={{
              color: '#64DD17',
              fontWeight: 'bold',
            }}
          >
            Matani
          </Typography>
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            display: 'block',
            fontSize: '0.8rem',
          }}
        >
          By Amanah Manajemen
        </Typography>
      </Box>
      <Divider sx={{ borderColor: '#4a5b6c' }} />
      <List component="nav">
        <ListItemButton component={Link} to="/" selected={location.pathname === '/'}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton onClick={handleClickMasterData}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <StorageIcon />
          </ListItemIcon>
          <ListItemText primary="Master Data" />
          {openMasterData ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openMasterData} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/master-data/lahan" selected={location.pathname === '/master-data/lahan'}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <LandscapeIcon sx={{ fontSize: '1.1rem' }} />
              </ListItemIcon>
              <ListItemText primary="Lahan" />
            </ListItemButton>
            <ListItemButton component={Link} to="/master-data/benih" selected={location.pathname === '/master-data/benih'}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <GrassIcon sx={{ fontSize: '1.1rem' }} />
              </ListItemIcon>
              <ListItemText primary="Benih" />
            </ListItemButton>
            <ListItemButton component={Link} to="/master-data/pupuk" selected={location.pathname === '/master-data/pupuk'}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <ScienceIcon sx={{ fontSize: '1.1rem' }} />
              </ListItemIcon>
              <ListItemText primary="Pupuk" />
            </ListItemButton>
            <ListItemButton component={Link} to="/master-data/pestisida" selected={location.pathname === '/master-data/pestisida'}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <BugReportIcon sx={{ fontSize: '1.1rem' }} />
              </ListItemIcon>
              <ListItemText primary="Pestisida" />
            </ListItemButton>
            <ListItemButton component={Link} to="/master-data/kebutuhan" selected={location.pathname === '/master-data/kebutuhan'}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <ShoppingBagIcon sx={{ fontSize: '1.1rem' }} />
              </ListItemIcon>
              <ListItemText primary="Kebutuhan" />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton onClick={handleClickKegiatan}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Kegiatan" />
          {openKegiatan ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openKegiatan} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/kegiatan/pengolahan-lahan" selected={location.pathname === '/kegiatan/pengolahan-lahan'}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <AgricultureIcon sx={{ fontSize: '1.1rem' }} />
              </ListItemIcon>
              <ListItemText primary="Pengolahan Lahan" />
            </ListItemButton>
            <ListItemButton component={Link} to="/kegiatan/penanaman" selected={location.pathname === '/kegiatan/penanaman'}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <LocalFloristIcon sx={{ fontSize: '1.1rem' }} />
              </ListItemIcon>
              <ListItemText primary="Penanaman" />
            </ListItemButton>
            <ListItemButton component={Link} to="/kegiatan/perawatan-tanaman" selected={location.pathname === '/kegiatan/perawatan-tanaman'}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <SpaIcon sx={{ fontSize: '1.1rem' }} />
              </ListItemIcon>
              <ListItemText primary="Perawatan Tanaman" />
            </ListItemButton>
            <ListItemButton component={Link} to="/kegiatan/penyemprotan" selected={location.pathname === '/kegiatan/penyemprotan'}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <WaterDropIcon sx={{ fontSize: '1.1rem' }} />
              </ListItemIcon>
              <ListItemText primary="Penyemprotan" />
            </ListItemButton>
            <ListItemButton component={Link} to="/kegiatan/panen" selected={location.pathname === '/kegiatan/panen'}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <ForestIcon sx={{ fontSize: '1.1rem' }} />
              </ListItemIcon>
              <ListItemText primary="Panen" />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton onClick={handleClickLaporan}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <ArticleIcon />
          </ListItemIcon>
          <ListItemText primary="Laporan" />
          {openLaporan ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openLaporan} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            <ListItemButton component={Link} to="/laporan/pengolahan-lahan" selected={location.pathname === '/laporan/pengolahan-lahan'}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <ArticleIcon sx={{ fontSize: '1.1rem' }} />
              </ListItemIcon>
              <ListItemText primary="Lap. Pengolahan Lahan" />
            </ListItemButton>
            <ListItemButton component={Link} to="/laporan/penanaman" selected={location.pathname === '/laporan/penanaman'}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <ArticleIcon sx={{ fontSize: '1.1rem' }} />
              </ListItemIcon>
              <ListItemText primary="Lap. Penanaman" />
            </ListItemButton>
            <ListItemButton component={Link} to="/laporan/perawatan-tanaman" selected={location.pathname === '/laporan/perawatan-tanaman'}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <ArticleIcon sx={{ fontSize: '1.1rem' }} />
              </ListItemIcon>
              <ListItemText primary="Lap. Perawatan Tanaman" />
            </ListItemButton>
            <ListItemButton component={Link} to="/laporan/penyemprotan" selected={location.pathname === '/laporan/penyemprotan'}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <ArticleIcon sx={{ fontSize: '1.1rem' }} />
              </ListItemIcon>
              <ListItemText primary="Lap. Penyemprotan" />
            </ListItemButton>
            <ListItemButton component={Link} to="/laporan/panen" selected={location.pathname === '/laporan/panen'}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <ArticleIcon sx={{ fontSize: '1.1rem' }} />
              </ListItemIcon>
              <ListItemText primary="Lap. Panen" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}> {/* Ini akan mendorong tombol logout ke bawah */}
        <Button
          variant="contained"
          color="error" // Warna merah untuk logout
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={onLogout}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
}

export default Sidebar;