
// import React, { useEffect, useState } from 'react';
// import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import { Toaster } from '@/components/ui/toaster';
// import { useToast } from '@/components/ui/use-toast';

// import LoginPage from '@/pages/LoginPage';
// import DashboardPage from '@/pages/DashboardPage';
// import StudentsPage from '@/pages/StudentsPage';
// import ToolsPage from '@/pages/ToolsPage';
// import HistoryPage from '@/pages/HistoryPage';
// import Layout from '@/components/Layout';
// import ReturnProcessPage from '@/pages/ReturnProcessPage';
// import ReportsPage from '@/pages/ReportsPage';
// import OverdueItemsPage from '@/pages/OverdueItemsPage';
// import StudentProfilePage from '@/pages/StudentProfilePage';
// import AdminProfilePage from '@/pages/AdminProfilePage';
// import NewLoanPage from '@/pages/NewLoanPage';

// const AppRoutes = () => {
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [token, setToken] = useState(null);

//   useEffect(() => {
//     const storedToken = localStorage.getItem('token');
//     const storedUser = localStorage.getItem('currentUser');

//     if (storedToken && storedUser) {
//       try {
//         setToken(storedToken);
//         setIsAuthenticated(true);
//         setCurrentUser(JSON.parse(storedUser));
//       } catch (err) {
//         console.error('Error parsing user from localStorage:', err);
//       }
//     }
//   }, []);

//   const handleLogin = async (email, password) => {
//     try {
//       const res = await fetch('http://localhost:3000/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!res.ok) {
//         throw new Error('Invalid credentials');
//       }

//       const data = await res.json();

//       localStorage.setItem('token', data.token);
//       localStorage.setItem('currentUser', JSON.stringify(data.supervisor));
//       setToken(data.token);
//       setCurrentUser(data.supervisor);
//       setIsAuthenticated(true);

//       toast({
//         title: 'Login exitoso',
//         description: `Bienvenido ${data.supervisor.name}`,
//       });

//       return true;
//     } catch (err) {
//       toast({
//         title: 'Error de login',
//         description: err.message || 'Algo salió mal',
//         variant: 'destructive',
//       });
//       return false;
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('currentUser');
//     setToken(null);
//     setCurrentUser(null);
//     setIsAuthenticated(false);

//     toast({
//       title: 'Sesión cerrada',
//       description: 'Has cerrado sesión correctamente.',
//     });
//   };

//   const renderWithLayout = (Component, props = {}) =>
//     isAuthenticated ? (
//       <Layout onLogout={handleLogout} currentUser={currentUser}>
//         <Component {...props} />
//       </Layout>
//     ) : (
//       <Navigate to="/login" />
//     );

//   return (
//     <Routes>
//       <Route
//         path="/login"
//         element={
//           isAuthenticated ? (
//             <Navigate to="/" />
//           ) : (
//             <LoginPage onLogin={handleLogin} />
//           )
//         }
//       />
//       <Route path="/" element={renderWithLayout(DashboardPage)} />
//       <Route path="/students" element={renderWithLayout(StudentsPage)} />
//       <Route path="/students/:studentId" element={renderWithLayout(StudentProfilePage)} />
//       <Route path="/tools" element={renderWithLayout(ToolsPage)} />
//       <Route path="/history" element={renderWithLayout(HistoryPage)} />
//       <Route path="/new-loan" element={renderWithLayout(NewLoanPage, { currentUser })} />
//       <Route path="/return-process" element={renderWithLayout(ReturnProcessPage)} />
//       <Route path="/reports" element={renderWithLayout(ReportsPage)} />
//       <Route path="/overdue-items" element={renderWithLayout(OverdueItemsPage)} />
//       <Route path="/admin-profile" element={renderWithLayout(AdminProfilePage)} />
//       <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} />} />
//     </Routes>
//   );
// };

// const App = () => (
//   <BrowserRouter>
//     <AppRoutes />
//     <Toaster />
//   </BrowserRouter>
// );

// export default App;





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

  // useEffect(() => {
  //   const storedToken = localStorage.getItem('token');
  //   const storedUser = localStorage.getItem('currentUser');

  //   if (storedToken && storedUser) {
  //     try {
  //       setToken(storedToken);
  //       setIsAuthenticated(true);
  //       setCurrentUser(JSON.parse(storedUser));
  //     } catch (err) {
  //       console.error('Error parsing user from localStorage:', err);
  //     }
  //   }
  // }, []);

  // const handleLogin = async (email, password, role = 'supervisor') => {
  // try {
  //   const endpoint = `http://localhost:3000/api/auth/login/${role}`;
  //   const res = await fetch(endpoint, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ email, password }),
  //   });

  //     if (!res.ok) {
  //       throw new Error('Invalid credentials');
  //     }

  //     const data = await res.json();

  //     localStorage.setItem('token', data.token);
  //     localStorage.setItem('currentUser', JSON.stringify(data.supervisor));
  //     setToken(data.token);
  //     setCurrentUser(data.supervisor);
  //     setIsAuthenticated(true);

  //     toast({
  //       title: 'Login exitoso',
  //       description: `Bienvenido ${data.supervisor.name}`,
  //     });

  //     return true;
  //   } catch (err) {
  //     toast({
  //       title: 'Error de login',
  //       description: err.message || 'Algo salió mal',
  //       variant: 'destructive',
  //     });
  //     return false;
  //   }
  // };
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

    localStorage.setItem('token', data.accessToken); // 👈 asegúrate de que sea accessToken y no token
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

// import React, { useEffect, useState } from 'react';
// import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import { Toaster } from '@/components/ui/toaster';
// import { useToast } from '@/components/ui/use-toast';

// import { AuthProvider } from '@/contexts/AuthContext'; // Asegúrate de tenerlo creado

// import LoginPage from '@/pages/LoginPage';
// import DashboardPage from '@/pages/DashboardPage';
// import StudentsPage from '@/pages/StudentsPage';
// import ToolsPage from '@/pages/ToolsPage';
// import HistoryPage from '@/pages/HistoryPage';
// import Layout from '@/components/Layout';
// import ReturnProcessPage from '@/pages/ReturnProcessPage';
// import ReportsPage from '@/pages/ReportsPage';
// import OverdueItemsPage from '@/pages/OverdueItemsPage';
// import StudentProfilePage from '@/pages/StudentProfilePage';
// import AdminProfilePage from '@/pages/AdminProfilePage';
// import NewLoanPage from '@/pages/NewLoanPage';

// const AppRoutes = () => {
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [token, setToken] = useState(null);

//   useEffect(() => {
//     const storedToken = localStorage.getItem('token');
//     const storedUser = localStorage.getItem('currentUser');

//     if (storedToken && storedUser) {
//       try {
//         setToken(storedToken);
//         setIsAuthenticated(true);
//         setCurrentUser(JSON.parse(storedUser));
//       } catch (err) {
//         console.error('Error parsing user from localStorage:', err);
//       }
//     }
//   }, []);

//   const handleLogin = async (email, password) => {
//     try {
//       const res = await fetch('http://localhost:3000/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!res.ok) {
//         throw new Error('Invalid credentials');
//       }

//       const data = await res.json();

//       localStorage.setItem('token', data.token);
//       localStorage.setItem('currentUser', JSON.stringify(data.supervisor));
//       setToken(data.token);
//       setCurrentUser(data.supervisor);
//       setIsAuthenticated(true);

//       toast({
//         title: 'Login exitoso',
//         description: `Bienvenido ${data.supervisor.name}`,
//       });

//       return true;
//     } catch (err) {
//       toast({
//         title: 'Error de login',
//         description: err.message || 'Algo salió mal',
//         variant: 'destructive',
//       });
//       return false;
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('currentUser');
//     setToken(null);
//     setCurrentUser(null);
//     setIsAuthenticated(false);

//     toast({
//       title: 'Sesión cerrada',
//       description: 'Has cerrado sesión correctamente.',
//     });
//   };

//   const renderWithLayout = (Component, props = {}) =>
//     isAuthenticated ? (
//       <Layout onLogout={handleLogout} currentUser={currentUser}>
//         <Component {...props} />
//       </Layout>
//     ) : (
//       <Navigate to="/login" />
//     );

//   return (
//     <Routes>
//       <Route
//         path="/login"
//         element={
//           isAuthenticated ? (
//             <Navigate to="/" />
//           ) : (
//             <LoginPage onLogin={handleLogin} />
//           )
//         }
//       />
//       <Route path="/" element={renderWithLayout(DashboardPage)} />
//       <Route path="/students" element={renderWithLayout(StudentsPage)} />
//       <Route path="/students/:studentId" element={renderWithLayout(StudentProfilePage)} />
//       <Route path="/tools" element={renderWithLayout(ToolsPage)} />
//       <Route path="/history" element={renderWithLayout(HistoryPage)} />
//       <Route path="/new-loan" element={renderWithLayout(NewLoanPage, { currentUser })} />
//       <Route path="/return-process" element={renderWithLayout(ReturnProcessPage)} />
//       <Route path="/reports" element={renderWithLayout(ReportsPage)} />
//       <Route path="/overdue-items" element={renderWithLayout(OverdueItemsPage)} />
//       <Route path="/admin-profile" element={renderWithLayout(AdminProfilePage)} />
//       <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} />} />
//     </Routes>
//   );
// };

// const App = () => (
//   <BrowserRouter>
//     <AuthProvider>
//       <AppRoutes />
//       <Toaster />
//     </AuthProvider>
//   </BrowserRouter>
// );

// export default App;


// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { Toaster } from '@/components/ui/toaster';

// import { AuthProvider } from '@/contexts/AuthContext';

// import LoginPage from '@/pages/LoginPage';
// import DashboardPage from '@/pages/DashboardPage';
// import StudentsPage from '@/pages/StudentsPage';
// import ToolsPage from '@/pages/ToolsPage';
// import HistoryPage from '@/pages/HistoryPage';
// import Layout from '@/components/Layout';
// import ReturnProcessPage from '@/pages/ReturnProcessPage';
// import ReportsPage from '@/pages/ReportsPage';
// import OverdueItemsPage from '@/pages/OverdueItemsPage';
// import StudentProfilePage from '@/pages/StudentProfilePage';
// import AdminProfilePage from '@/pages/AdminProfilePage';
// import NewLoanPage from '@/pages/NewLoanPage';
// import ProtectedRoute from '@/components/ProtectedRoute';

// const App = () => (
//   <BrowserRouter>
//     <AuthProvider>
//       <Routes>
//         <Route path="/login" element={<LoginPage />} />
        
//         {/* Rutas protegidas */}
//         <Route path="/" element={
//           <ProtectedRoute>
//             <Layout>
//               <DashboardPage />
//             </Layout>
//           </ProtectedRoute>
//         } />
        
//         <Route path="/students" element={
//           <ProtectedRoute>
//             <Layout>
//               <StudentsPage />
//             </Layout>
//           </ProtectedRoute>
//         } />
        
//         <Route path="/students/:studentId" element={
//           <ProtectedRoute>
//             <Layout>
//               <StudentProfilePage />
//             </Layout>
//           </ProtectedRoute>
//         } />
        
//         <Route path="/tools" element={
//           <ProtectedRoute>
//             <Layout>
//               <ToolsPage />
//             </Layout>
//           </ProtectedRoute>
//         } />
        
//         <Route path="/history" element={
//           <ProtectedRoute>
//             <Layout>
//               <HistoryPage />
//             </Layout>
//           </ProtectedRoute>
//         } />
        
//         <Route path="/new-loan" element={
//           <ProtectedRoute>
//             <Layout>
//               <NewLoanPage />
//             </Layout>
//           </ProtectedRoute>
//         } />
        
//         <Route path="/return-process" element={
//           <ProtectedRoute>
//             <Layout>
//               <ReturnProcessPage />
//             </Layout>
//           </ProtectedRoute>
//         } />
        
//         <Route path="/reports" element={
//           <ProtectedRoute>
//             <Layout>
//               <ReportsPage />
//             </Layout>
//           </ProtectedRoute>
//         } />
        
//         <Route path="/overdue-items" element={
//           <ProtectedRoute>
//             <Layout>
//               <OverdueItemsPage />
//             </Layout>
//           </ProtectedRoute>
//         } />
        
//         <Route path="/admin-profile" element={
//           <ProtectedRoute>
//             <Layout>
//               <AdminProfilePage />
//             </Layout>
//           </ProtectedRoute>
//         } />
        
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//       <Toaster />
//     </AuthProvider>
//   </BrowserRouter>
// );

// export default App;