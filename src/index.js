import React from 'react';
import ReactDOM from 'react-dom/client';
// import 'antd-mobile-v2/dist/antd-mobile.css';  // or 'antd-mobile-v2/dist/antd-mobile.css'
// 导入 react-virtualized 组件的样式
import 'react-virtualized/styles.css'

import './assets/fonts/iconfont.css'
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
