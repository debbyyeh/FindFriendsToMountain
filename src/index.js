import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import App from './App'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Profile from './pages/Profile/Profile'
import Activity from './pages/Activity/Activity'
import ActivityContent from './pages/Activity/ActivityContent'
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="profile" element={<Profile />} />
        <Route path="activity" element={<Activity />} />
        <Route path="activity/:id" element={<ActivityContent />} />
      </Route>
    </Routes>
  </BrowserRouter>,
)
