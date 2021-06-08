/* eslint-disable no-unused-vars */
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import ErrorBoundary from './services/ErrorBoundary'
import { BrowserRouter } from 'react-router-dom'
import api from './api'

ReactDOM.render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>,
    document.getElementById('root')
)

window.api = api

// console.log(api)
