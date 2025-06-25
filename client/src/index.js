import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <--- Import BrowserRouter
import './styles/App.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}> {/* <--- Gunakan BrowserRouter di sini */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);