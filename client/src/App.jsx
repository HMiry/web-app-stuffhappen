import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Index from "./pages/Index";
import Themes from "./pages/Themes";
import Profile from "./pages/Profile";
import Game from "./pages/Game";
import DemoGame from "./pages/DemoGame";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Loading component
const LoadingScreen = () => (
  <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{backgroundColor: '#f8fafc'}}>
    <div className="text-center">
      <div className="spinner-border text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
        <span className="visually-hidden">Loading...</span>
      </div>
                      <h5 className="text-muted">Loading Stuff Happens ...</h5>
    </div>
  </div>
);

// App Routes component that has access to auth context
const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/themes" element={<Themes />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/game" element={<Game />} />
      <Route path="/demo" element={<DemoGame />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);

export default App; 