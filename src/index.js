// C:\apps\TestCode\BRS\brs-calculator\src\index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Keep this if you have a global CSS file
import App from './App'; // <-- This is the important line: import App
import reportWebVitals from './reportWebVitals'; // Keep this if you want web vitals reporting

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App /> {/* <-- Render your App component here */}
  </React.StrictMode>
);

reportWebVitals(); // Keep this if you want web vitals reporting