import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import WelcomePage from './pages/WelcomePage';
import SelectGamePage from './pages/SelectGamePage';
import PlayGamePage from './pages/PlayGamePage';
import { AuthProvider } from './context/AuthContext';



// Helper to wrap AnimatePresence correctly
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <AuthProvider>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/select-game" element={<SelectGamePage />} />
          <Route path="/play-game/:id" element={<PlayGamePage />} />
        </Routes>
      </AuthProvider>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
