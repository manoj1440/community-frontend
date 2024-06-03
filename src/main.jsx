import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ConfigProvider } from 'antd';


const defaultData = {
  borderRadius: 6,
  colorPrimary: '#c20b48',
  Button: {
    colorPrimary: '#c20b48',
  },
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: defaultData.colorPrimary,
          borderRadius: defaultData.borderRadius,
        },
        components: {
          Button: {
            colorPrimary: defaultData.colorPrimary
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
