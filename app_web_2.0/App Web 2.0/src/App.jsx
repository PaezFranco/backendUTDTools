
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';

import { AuthProvider } from '@/contexts/AuthContext'; // Asegúrate de tenerlo creado

import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import StudentsPage from '@/pages/StudentsPage';
import ToolsPage from '@/pages/ToolsPage';
import HistoryPage from '@/pages/HistoryPage';
import Layout from '@/components/Layout';
import ReturnProcessPage from '@/pages/ReturnProcessPage';
import ReportsPage from '@/pages/ReportsPage';
import OverdueItemsPage from '@/pages/OverdueItemsPage';
import StudentProfilePage from '@/pages/StudentProfilePage';
import AdminProfilePage from '@/pages/AdminProfilePage';
import NewLoanPage from '@/pages/NewLoanPage';




const AppRoutes = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);

useEffect(() => {
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('currentUser');

  if (storedToken && storedUser) {
    try {
      setToken(storedToken);
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(storedUser));
    } catch (err) {
      console.error('Error parsing user from localStorage:', err);
    }
  } else {
    // Si no hay token guardado, intenta refrescar
    const refreshSession = async () => {
      console.log('🔄 Intentando refrescar sesión...');
      try {
        const res = await fetch('http://localhost:3000/api/auth/refresh', {
          method: 'GET',
          credentials: 'include', // 👈 importante
        });

        if (!res.ok) {
          throw new Error('No se pudo refrescar el token');
        }

        const data = await res.json();

        if (!data.accessToken || !data.user) {
          throw new Error('Respuesta incompleta del servidor');
        }

        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        setToken(data.accessToken);
        setCurrentUser(data.user);
        setIsAuthenticated(true);

        toast({
          title: 'Sesión restaurada',
          description: `Bienvenido de nuevo ${data.user.name || data.user.email}`,
        });
      } catch (err) {
        console.warn('🔐 No se pudo restaurar sesión:', err.message);
        setIsAuthenticated(false);
        setToken(null);
        setCurrentUser(null);
      }
    };

    refreshSession();
  }
}, []);

  const handleLogin = async (email, password) => {
  try {
    const endpoint = `http://localhost:3000/api/auth/login/supervisor`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // por si usas cookies para refreshToken
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error('Credenciales inválidas');
    }

    const data = await res.json();

    if (!data.supervisor) {
      throw new Error('No se recibió el supervisor desde el servidor.');
    }

    localStorage.setItem('token', data.accessToken); 
    localStorage.setItem('currentUser', JSON.stringify(data.supervisor));
    setToken(data.accessToken);
    setCurrentUser(data.supervisor);
    setIsAuthenticated(true);

    toast({
      title: 'Login exitoso',
      description: `Bienvenido ${data.supervisor.name || data.supervisor.email}`,
    });

    return true;
  } catch (err) {
    toast({
      title: 'Error de login',
      description: err.message || 'Algo salió mal',
      variant: 'destructive',
    });
    return false;
  }
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);

    toast({
      title: 'Sesión cerrada',
      description: 'Has cerrado sesión correctamente.',
    });
  };

  const renderWithLayout = (Component, props = {}) =>
    isAuthenticated ? (
      <Layout onLogout={handleLogout} currentUser={currentUser}>
        <Component {...props} />
      </Layout>
    ) : (
      <Navigate to="/login" />
    );

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/" />
          ) : (
            <LoginPage onLogin={handleLogin} />
          )
        }
      />
      <Route path="/" element={renderWithLayout(DashboardPage)} />
      <Route path="/students" element={renderWithLayout(StudentsPage)} />
      <Route path="/students/:studentId" element={renderWithLayout(StudentProfilePage)} />
      <Route path="/tools" element={renderWithLayout(ToolsPage)} />
      <Route path="/history" element={renderWithLayout(HistoryPage)} />
      <Route path="/new-loan" element={renderWithLayout(NewLoanPage, { currentUser })} />
      <Route path="/return-process" element={renderWithLayout(ReturnProcessPage)} />
      <Route path="/reports" element={renderWithLayout(ReportsPage)} />
      <Route path="/overdue-items" element={renderWithLayout(OverdueItemsPage)} />
      <Route path="/admin-profile" element={renderWithLayout(AdminProfilePage)} />
      <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} />} />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
      <Toaster />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
