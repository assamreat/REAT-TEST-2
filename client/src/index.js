import React from 'react';
import ReactDOM from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

console.log('nsdl key is', process.env.REACT_APP_NSDL_KEY);
console.log('marchant ID is', process.env.REACT_APP_MERCHANT_ID);
console.log('env is', process.env.NODE_ENV);
