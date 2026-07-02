import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './stores/authStore';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Editor from './pages/Editor';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import PublicInvitation from './pages/PublicInvitation';

export default function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
        <Route path="/editor/:id" element={user ? <Editor /> : <Navigate to="/auth" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
        <Route path="/checkout/:tier" element={user ? <Checkout /> : <Navigate to="/auth" />} />
        <Route path="/invite/:url" element={<PublicInvitation />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
