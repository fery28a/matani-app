// client/src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // 'Link' telah dihapus karena tidak digunakan di sini

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

import './styles/App.css'; // Gaya global aplikasi

function App() {
  return (
    // <BrowserRouter> TIDAK ADA DI SINI. Ia ada di client/src/index.js
    <div className="app-container">
      {/* Sidebar akan selalu tampil karena tidak ada lagi login */}
      <Sidebar /> 

      {/* Area konten utama yang akan menampilkan halaman */}
      <main className="content">
        <Routes>
          {/* Semua Rute aplikasi sekarang bersifat publik dan langsung diakses */}
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
          
          {/* Rute Catch-all untuk URL yang tidak cocok */}
          <Route path="*" element={<h2>Halaman Tidak Ditemukan</h2>} />
        </Routes>
      </main>
    </div>
    // </Router> TIDAK ADA DI SINI.
  );
}

export default App;