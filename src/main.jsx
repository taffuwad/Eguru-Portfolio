import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import './index.css'
import App from './App.jsx'

const redirectParams = new URLSearchParams(window.location.search);
const redirectPath = redirectParams.get('p');

if (redirectPath) {
  const redirectQuery = redirectParams.get('q');
  const redirectHash = redirectParams.get('h');
  const restoredUrl = `${import.meta.env.BASE_URL.replace(/\/$/, '')}${redirectPath}` +
    `${redirectQuery ? `?${redirectQuery}` : ''}` +
    `${redirectHash ? `#${redirectHash}` : ''}`;

  window.history.replaceState(null, '', restoredUrl);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
