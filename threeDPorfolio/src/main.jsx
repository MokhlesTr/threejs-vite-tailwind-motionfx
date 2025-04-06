import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
// Get this from your EmailJS dashboard
emailjs.init("0DGS6JZFXutETtzfP");

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
