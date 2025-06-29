// client/src/index.js (Pastikan isinya seperti ini)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Pastikan ini diimpor
import './styles/App.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}> {/* BrowserRouter HANYA ADA DI SINI */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);