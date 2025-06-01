import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

document.documentElement.classList.add('dark');
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
        <App />
      </BrowserRouter>
        </StrictMode>
);