import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Users, Wrench, AlertTriangle, Clock, CheckSquare, UserPlus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Datos mock para registros pendientes - estos vendrían del backend en una implementación completa
const mockPendingRegistrationsInitial = [
  { id: 'TEMP001', name: 'Juan Pérez', studentId: '3141230010', registrationDate: '2025-06-13' },
  { id: 'TEMP002', name: 'Maria Rodríguez', studentId: '3141230011', registrationDate: '2025-06-14' },
  { id: 'TEMP003', name: 'Carlos López', studentId: '3141230012', registrationDate: '2025-06-14' },
  { id: 'TEMP004', name: 'Laura Gómez', studentId: '3141230013', registrationDate: '2025-06-15' },
  { id: 'TEMP005', name: 'Pedro Martinez', studentId: '3141230014', registrationDate: '2025-06-15' },
];

const DashboardPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [showAllPending, setShowAllPending] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    activeTools: 0,
    ongoingLoans: 3, // Esto podría venir del backend también
    maintenanceTools: 0,
    totalStudents: 0,
    mostRequested: [
        { name: "Taladro Percutor Bosch", requests: 15 },
        { name: "Sierra Circular Skil", requests: 10 },
        { name: "Kit Destornilladores", requests: 8 },
    ],
  });

  // Función para cargar estadísticas desde el backend
  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Cargar estudiantes desde el backend
      const studentsResponse = await fetch(`${API_URL}/students`);
      if (!studentsResponse.ok) {
        throw new Error('Error al cargar estudiantes');
      }
      const students = await studentsResponse.json();
      
      // Aquí podrías cargar herramientas si tienes ese endpoint
      // const toolsResponse = await fetch(`${API_URL}/tools`);
      // const tools = await toolsResponse.json();
      
      // Por ahora solo actualizamos el total de estudiantes
      setDashboardStats(prevStats => ({
        ...prevStats,
        totalStudents: students.length,
        // activeTools: tools.filter(tool => tool.status === 'available').length,
        // maintenanceTools: tools.filter(tool => tool.status === 'maintenance').length,
      }));

    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas del dashboard",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Cargar registros pendientes (por ahora usamos datos mock)
  useEffect(() => {
    // En una implementación completa, esto vendría del backend
    // const loadPendingRegistrations = async () => {...}
    setPendingRegistrations(mockPendingRegistrationsInitial);
    loadDashboardStats();
  }, []);

  const handleCompleteRegistration = (pendingStudent) => {
    setPendingRegistrations(prev => prev.filter(s => s.id !== pendingStudent.id));
    
    toast({
      title: "Redirigiendo para Completar Registro",
      description: `Preparando formulario para ${pendingStudent.name} (Matrícula: ${pendingStudent.studentId}).`,
    });
    
    navigate('/students', { 
      state: { 
        action: 'completeRegistration', 
        pendingStudentData: { 
          name: pendingStudent.name, 
          studentId: pendingStudent.studentId 
        } 
      } 
    });
  };

  const displayedPendingRegistrations = showAllPending ? pendingRegistrations : pendingRegistrations.slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando dashboard...</span>
      </div>
    );
  }


  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="text-3xl font-bold text-gradient-gold-teal">Dashboard General</h1>
        <p className="text-muted-foreground">Resumen de la actividad y estado del sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Herramientas Activas', value: dashboardStats.activeTools, icon: <Wrench className="h-6 w-6 text-primary" />, color: 'text-primary', path: '/tools' },
          { title: 'Préstamos en Curso', value: dashboardStats.ongoingLoans, icon: <Clock className="h-6 w-6 text-custom-orange" />, color: 'text-custom-orange', path: '/history?filter=active_loans' },
          { title: 'Herramientas en Mantenimiento', value: dashboardStats.maintenanceTools, icon: <AlertTriangle className="h-6 w-6 text-destructive" />, color: 'text-destructive', path: '/tools?filter=maintenance' },
          { title: 'Total Estudiantes', value: dashboardStats.totalStudents, icon: <Users className="h-6 w-6 text-secondary" />, color: 'text-secondary', path: '/students' },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link to={stat.path} className="block">
              <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow duration-300 hover:border-primary/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className={`text-sm font-medium ${stat.color}`}>{stat.title}</CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                  <p className="text-xs text-muted-foreground pt-1">Actualizado recientemente</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
        >
          <Card className="bg-card shadow-lg h-full">
            <CardHeader>
              <CardTitle className="text-xl text-gradient-gold-teal flex items-center"><BarChart className="mr-2 h-5 w-5" /> Herramientas Más Solicitadas</CardTitle>
              <CardDescription>Top herramientas por número de préstamos.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {dashboardStats.mostRequested.map(tool => (
                  <li key={tool.name} className="flex justify-between items-center text-sm">
                    <span className="text-foreground truncate pr-2">{tool.name}</span>
                    <span className="font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{tool.requests} sol.</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
        >
          <Card className="bg-card shadow-lg h-full">
            <CardHeader>
              <CardTitle className="text-xl text-gradient-gold-teal flex items-center"><UserPlus className="mr-2 h-5 w-5" /> Registros Pendientes de App Móvil</CardTitle>
              <CardDescription>Estudiantes registrados desde la app móvil que requieren completar datos.</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRegistrations.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-custom-gold">Nombre</TableHead>
                        <TableHead className="text-custom-gold hidden sm:table-cell">Matrícula</TableHead>
                        <TableHead className="text-custom-gold hidden md:table-cell">Fecha Registro App</TableHead>
                        <TableHead className="text-custom-gold text-right">Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedPendingRegistrations.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium text-foreground">{student.name}</TableCell>
                          <TableCell className="text-muted-foreground hidden sm:table-cell">{student.studentId}</TableCell>
                          <TableCell className="text-muted-foreground hidden md:table-cell">{new Date(student.registrationDate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" onClick={() => handleCompleteRegistration(student)} className="border-primary text-primary hover:bg-primary/10">
                              <CheckSquare className="mr-1 h-4 w-4" /> Completar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {pendingRegistrations.length > 3 && (
                    <div className="mt-4 text-center">
                      <Button variant="link" onClick={() => setShowAllPending(!showAllPending)} className="text-primary">
                        {showAllPending ? 'Mostrar Menos' : `Mostrar Todos (${pendingRegistrations.length})`}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground text-center py-6">No hay registros pendientes por el momento. ¡Todo al día!</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
    </motion.div>
  );
};

export default DashboardPage;

