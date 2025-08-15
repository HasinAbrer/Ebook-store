import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routers/router.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import AuthInit from './components/AuthInit.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AuthProvider>
      <AuthInit>
        <RouterProvider router={router} />
      </AuthInit>
    </AuthProvider>
  </Provider>,
)
