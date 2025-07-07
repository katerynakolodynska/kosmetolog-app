import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import './i18n.js';
import { store } from './redux/store.js';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop />
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
