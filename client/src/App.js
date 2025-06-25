// client/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

// Import halaman login dan authService
import Login from './pages/Auth/Login'; // <--- TAMBAH BARIS INI
import { logout, getUserInfo } from './services/authService'; // <--- TAMBAH BARIS INI

// Import komponen Sidebar
import Sidebar from './components/layout/Sidebar';

// Import Halaman Master Data
import Dashboard from './pages/Dashboard';
import Lahan from './pages/MasterData/Lahan';
import Benih from './pages/MasterData/Benih';
import Pupuk from './pages/MasterData/Pupuk';
import Pestisida from './pages/MasterData/Pestisida';
import Kebutuhan from './pages/MasterData/Kebutuhan';

// Import Halaman Kegiatan
import PengolahanLahan from './pages/Kegiatan/PengolahanLahan';
import Penanaman from './pages/Kegiatan/Penanaman';
import PerawatanTanaman from './pages/Kegiatan/PerawatanTanaman';
import Penyemprotan from './pages/Kegiatan/Penyemprotan';
import Panen from './pages/Kegiatan/Panen';

// Import Halaman Laporan
import LapPengolahanLahan from './pages/Laporan/LapPengolahanLahan';
import LapPenanaman from './pages/Laporan/LapPenanaman';
import LapPerawatanTanaman from './pages/Laporan/LapPerawatanTanaman';
import LapPenyemprotan from './pages/Laporan/LapPenyemprotan';
import LapPanen from './pages/Laporan/LapPanen';

import './styles/App.css';

// Komponen PrivateRoute untuk melindungi rute
const PrivateRoute = ({ children }) => {
  const userInfo = getUserInfo();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  return userInfo ? children : null;
};

function App() {
  const navigate = useNavigate(); // Dapatkan navigate dari hook

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect ke halaman login setelah logout
  };

  return (
    <div className="app-container">
      {getUserInfo() ? <Sidebar onLogout={handleLogout} /> : null} {/* Sidebar hanya tampil jika sudah login */}

      <main className="content">
        <Routes>
          {/* Rute Login (Public) */}
          <Route path="/login" element={<Login />} />

          {/* Rute yang Dilindungi (Private) */}
          <Route
            path="/*" // Semua rute lain akan dilindungi
            element={
              <PrivateRoute>
                <Routes> {/* Nested Routes di dalam PrivateRoute */}
                  <Route path="/" element={<Dashboard />} />
                  {/* Rute Master Data */}
                  <Route path="/master-data/lahan" element={<Lahan />} />
                  <Route path="/master-data/benih" element={<Benih />} />
                  <Route path="/master-data/pupuk" element={<Pupuk />} />
                  <Route path="/master-data/pestisida" element={<Pestisida />} />
                  <Route path="/master-data/kebutuhan" element={<Kebutuhan />} />
                  {/* Rute Kegiatan */}
                  <Route path="/kegiatan/pengolahan-lahan" element={<PengolahanLahan />} />
                  <Route path="/kegiatan/penanaman" element={<Penanaman />} />
                  <Route path="/kegiatan/perawatan-tanaman" element={<PerawatanTanaman />} />
                  <Route path="/kegiatan/penyemprotan" element={<Penyemprotan />} />
                  <Route path="/kegiatan/panen" element={<Panen />} />
                  {/* Rute Laporan */}
                  <Route path="/laporan/pengolahan-lahan" element={<LapPengolahanLahan />} />
                  <Route path="/laporan/penanaman" element={<LapPenanaman />} />
                  <Route path="/laporan/perawatan-tanaman" element={<LapPerawatanTanaman />} />
                  <Route path="/laporan/penyemprotan" element={<LapPenyemprotan />} />
                  <Route path="/laporan/panen" element={<LapPanen />} />
                  {/* Rute Catch-all jika tidak ditemukan di dalam protected routes */}
                  <Route path="*" element={<h2>Halaman Tidak Ditemukan (Protected)</h2>} />
                </Routes>
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

// Wrap App component with BrowserRouter in index.js
// This App.js now needs to be used without BrowserRouter directly if it's nested
// Let's modify index.js to handle BrowserRouter.

export default App;