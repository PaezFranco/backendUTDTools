
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // URL base de tu API
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  // ========== Renovar Access Token (useCallback para evitar dependencias circulares) ==========
  const refreshAccessToken = useCallback(async () => {
    try {
      console.log(' Attempting to refresh access token...');
      console.log(' Document cookies:', document.cookie);
      
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(' Refresh response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log(' Token refreshed successfully');
        
        // Actualizar estado de forma controlada
        setAccessToken(prevToken => {
          if (prevToken !== data.accessToken) {
            return data.accessToken;
          }
          return prevToken;
        });
        
        setUser(prevUser => {
          if (JSON.stringify(prevUser) !== JSON.stringify(data.user)) {
            return data.user;
          }
          return prevUser;
        });
        
        return { success: true, data };
      } else {
        const errorData = await response.text();
        console.log(' Refresh failed:', errorData);
        return { success: false, error: errorData };
      }
    } catch (error) {
      console.error(' Error refreshing token:', error);
      return { success: false, error: error.message };
    }
  }, [API_BASE_URL]); // Solo depende de API_BASE_URL

  // ========== Función para hacer peticiones con token automático ==========
  const apiRequest = useCallback(async (url, options = {}) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    // Agregar token de acceso si existe
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    try {
      let response = await fetch(`${API_BASE_URL}${url}`, config);

      // Si el token expiró, intentar renovarlo
      if (response.status === 401) {
        const refreshResult = await refreshAccessToken();
        if (refreshResult.success) {
          // Reintentar la petición con el nuevo token
          config.headers.Authorization = `Bearer ${refreshResult.data.accessToken}`;
          response = await fetch(`${API_BASE_URL}${url}`, config);
        } else {
          // No se pudo renovar, hacer logout
          await logout();
          throw new Error('Session expired');
        }
      }

      return response;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }, [accessToken, API_BASE_URL, refreshAccessToken]);

  // ========== Login ==========
  const login = async (email, password, userType = 'supervisor') => {
    try {
      console.log(' Attempting login for:', email);
      
      const response = await fetch(`${API_BASE_URL}/auth/login/${userType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      console.log(' Login response status:', response.status);

      const data = await response.json();

      if (response.ok) {
        console.log(' Login successful');
        
        // Actualizar estado de forma síncrona
        setAccessToken(data.accessToken);
        setUser(data.user);
        
        // Debug: Ver si las cookies se guardaron
        setTimeout(() => {
          console.log(' Cookies after login:', document.cookie);
        }, 100);
        
        toast({
          title: 'Inicio de sesión exitoso',
          description: `Bienvenido, ${data.user.email}`,
        });
        
        return true;
      } else {
        console.log(' Login failed:', data);
        toast({
          title: 'Error de autenticación',
          description: data.message || 'Credenciales inválidas',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error de conexión',
        description: 'No se pudo conectar con el servidor',
        variant: 'destructive',
      });
      return false;
    }
  };

  // ========== Register Student ==========
  const registerStudent = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Registro exitoso',
          description: 'Estudiante registrado correctamente',
        });
        return true;
      } else {
        toast({
          title: 'Error de registro',
          description: data.message || 'Error al registrar estudiante',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Register error:', error);
      toast({
        title: 'Error de conexión',
        description: 'No se pudo conectar con el servidor',
        variant: 'destructive',
      });
      return false;
    }
  };

  // ========== Logout ==========
  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAccessToken(null);
      setUser(null);
      
      toast({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión correctamente',
      });
    }
  }, [API_BASE_URL, toast]);

  // ========== Logout de todas las sesiones ==========
  const logoutAllSessions = async () => {
    try {
      await apiRequest('/auth/logout-all', {
        method: 'POST',
      });
      
      setAccessToken(null);
      setUser(null);
      
      toast({
        title: 'Todas las sesiones cerradas',
        description: 'Se han cerrado todas las sesiones activas',
      });
    } catch (error) {
      console.error('Logout all sessions error:', error);
      toast({
        title: 'Error',
        description: 'Error al cerrar todas las sesiones',
        variant: 'destructive',
      });
    }
  };

  // ========== Verificar autenticación al cargar (SOLO UNA VEZ) ==========
  useEffect(() => {
    let isMounted = true;
    let isInitialCheck = true;

    const checkAuth = async () => {
      if (!isInitialCheck) return; // Solo ejecutar una vez
      
      try {
        console.log(' Checking initial authentication...');
        const refreshResult = await refreshAccessToken();
        
        if (isMounted) {
          if (!refreshResult.success) {
            console.log(' No valid session found');
            setAccessToken(null);
            setUser(null);
          } else {
            console.log(' Valid session restored');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (isMounted) {
          setAccessToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
        isInitialCheck = false; // Marcar como completado
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []); // IMPORTANTE: array vacío para que solo se ejecute una vez

  // ========== Auto-refresh token cada 9 minutos (SOLO cuando hay token) ==========
  useEffect(() => {
    if (!accessToken) return;

    console.log('Setting up auto-refresh interval');
    const interval = setInterval(() => {
      console.log('Auto-refreshing token...');
      refreshAccessToken();
    }, 9 * 60 * 1000); // 9 minutos (antes de que expire)

    return () => {
      console.log('Clearing auto-refresh interval');
      clearInterval(interval);
    };
  }, [accessToken, refreshAccessToken]);

  const value = {
    user,
    accessToken,
    loading,
    login,
    registerStudent,
    logout,
    logoutAllSessions,
    apiRequest,
    refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};