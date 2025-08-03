import React from 'react';
import ReactDOM from 'react-dom/client';
import 'antd/dist/reset.css'; // Import Ant Design styles
import './index.css';
import './App.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import '@ant-design/v5-patch-for-react-19';
import axios from 'axios';

// Use environment variable for API URL, fallback to relative path for proxy
const API_BASE_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api/users/v1`
  : '/api/users/v1';

axios.defaults.baseURL = API_BASE_URL;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
