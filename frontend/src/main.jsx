import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import DemoApp from './DemoApp.jsx'
import './index.css'

// Use DemoApp for GitHub Pages deployment, App for local development
const isProduction = import.meta.env.PROD;
const AppComponent = isProduction ? DemoApp : App;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppComponent />
  </React.StrictMode>,
)
