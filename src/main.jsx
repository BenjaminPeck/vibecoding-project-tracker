import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { applyTheme, loadTheme } from './data/theme.js';

try { applyTheme(loadTheme(window.localStorage)); }
catch { applyTheme('light'); }

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
