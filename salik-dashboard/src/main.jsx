import { createRoot } from 'react-dom/client'
import MainLayout from './layout/MainLayout.jsx'
import { Provider } from "react-redux";
import store from './redux/store.js';
import "./styles/App.css"
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <MainLayout />
  </Provider>
)
