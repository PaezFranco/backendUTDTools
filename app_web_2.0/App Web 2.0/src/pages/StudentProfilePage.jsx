
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Mail, Phone, BookOpen, BarChart3, Edit, AlertCircle, CheckCircle, UserX, UserCheck, CalendarPlus, FileText, Fingerprint as FingerprintIcon, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const StudentProfilePage = () => {
  const { studentId: routeStudentId } = useParams(); 
  const [student, setStudent] = useState(null);
  const [loanHistory, setLoanHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingLoans, setLoadingLoans] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Función para mapear datos del backend al formato del frontend
  const mapBackendToFrontend = (backendStudent) => {
    return {
      id: backendStudent._id,
      studentId: backendStudent.student_id,
      name: backendStudent.full_name || '',
      email: backendStudent.email,
      status: backendStudent.blocked ? 'Bloqueado' : 'Activo',
      loans: 0, // Este campo será actualizado con los préstamos reales
      career: backendStudent.career || '',
      cuatrimestre: backendStudent.semester || 1,
      phone: backendStudent.phone || '',
      registrationDate: backendStudent.registration_date ? new Date(backendStudent.registration_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      blockReason: backendStudent.block_reason || '',
      fingerprintId: backendStudent.registered_fingerprint ? 'Registrada' : `FP-SIM-${backendStudent.student_id?.slice(-3) || '000'}`,
      group: backendStudent.group || ''
    };
  };

  // Función para mapear préstamos del backend al formato del frontend
  const mapLoanToFrontend = (loan) => {
    console.log('Mapping loan:', loan); // Debug log
    
    const loanDate = new Date(loan.loan_date);
    const estimatedReturnDate = new Date(loan.estimated_return_date);
    const actualReturnDate = loan.actual_return_date ? new Date(loan.actual_return_date) : null;

    // Determinar el estado del préstamo
    let status = 'Activo';
    let statusClass = 'bg-blue-500/20 text-blue-400';

    if (loan.status === 'returned') {
      if (actualReturnDate && actualReturnDate > estimatedReturnDate) {
        status = 'Retraso Leve';
        statusClass = 'bg-yellow-500/20 text-yellow-400';
      } else {
        status = 'OK';
        statusClass = 'bg-green-500/20 text-green-400';
      }
    } else if (loan.status === 'delayed' || (new Date() > estimatedReturnDate && loan.status === 'active')) {
      status = 'Vencido';
      statusClass = 'bg-red-500/20 text-red-400';
    }

    // Crear el nombre de las herramientas con mejor manejo de errores
    let toolNames = 'Herramientas no disponibles';
    
    try {
      if (loan.tools_borrowed && Array.isArray(loan.tools_borrowed)) {
        toolNames = loan.tools_borrowed.map(toolBorrowed => {
          const tool = toolBorrowed.tool_id;
          if (tool && typeof tool === 'object') {
            // Si tool_id está populado correctamente
            return `${tool.name || 'Sin nombre'} (${tool.code || 'Sin código'}) - Cant: ${toolBorrowed.quantity || 1}`;
          } else {
            // Si tool_id no está populado, mostrar el ID
            return `Herramienta ID: ${tool || toolBorrowed.tool_id} - Cant: ${toolBorrowed.quantity || 1}`;
          }
        }).join(', ');
      }
    } catch (error) {
      console.error('Error processing tools for loan:', loan._id, error);
      toolNames = 'Error al cargar herramientas';
    }

    return {
      id: loan._id,
      toolName: toolNames,
      loanTime: loanDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      loanDate: loanDate.toLocaleDateString('es-ES'),
      dueDate: estimatedReturnDate.toISOString(),
      returnDate: actualReturnDate ? actualReturnDate.toISOString() : null,
      type: loan.status === 'returned' ? 'Préstamo/Devolución' : (status === 'Vencido' ? 'Préstamo Vencido' : 'Préstamo'),
      status: status,
      statusClass: statusClass,
      configuredTime: loan.configured_time || 0
    };
  };

  // Función para cargar préstamos del estudiante
  const loadStudentLoans = async (studentCode) => {
    try {
      setLoadingLoans(true);
      console.log(`Loading loans for student code: ${studentCode}`); // Debug log
      
      const response = await fetch(`${API_URL}/loans/student-code/${studentCode}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('No loans found for student'); // Debug log
          setLoanHistory([]);
          return;
        }
        throw new Error(`Error al cargar préstamos: ${response.status} ${response.statusText}`);
      }

      const loans = await response.json();
      console.log('Received loans:', loans); // Debug log
      
      if (!Array.isArray(loans)) {
        console.error('Expected array of loans, received:', typeof loans);
        setLoanHistory([]);
        return;
      }

      const mappedLoans = loans.map(mapLoanToFrontend);
      console.log('Mapped loans:', mappedLoans); // Debug log
      
      setLoanHistory(mappedLoans);

      // Actualizar el número de préstamos activos/vencidos
      const activeLoans = mappedLoans.filter(loan => 
        loan.status === 'Activo' || loan.status === 'Vencido'
      ).length;

      setStudent(prev => ({ ...prev, loans: activeLoans }));

    } catch (error) {
      console.error('Error loading student loans:', error);
      toast({
        title: "Advertencia",
        description: `No se pudieron cargar los préstamos del estudiante: ${error.message}`,
        variant: "destructive"
      });
      setLoanHistory([]);
    } finally {
      setLoadingLoans(false);
    }
  };

  useEffect(() => {
    const loadStudent = async () => {
      try {
        setLoading(true);
        console.log(`Loading student with ID: ${routeStudentId}`); // Debug log
        
        const response = await fetch(`${API_URL}/students`);
        if (!response.ok) {
          throw new Error('Error al cargar estudiantes');
        }
        
        const backendStudents = await response.json();
        console.log('All students:', backendStudents); // Debug log
        
        const foundStudent = backendStudents.find(s => s._id === routeStudentId);
        console.log('Found student:', foundStudent); // Debug log
        
        if (foundStudent) {
          const mappedStudent = mapBackendToFrontend(foundStudent);
          setStudent(mappedStudent);
          
          // Cargar historial de préstamos real usando el student_id (matrícula)
          await loadStudentLoans(foundStudent.student_id);
        } else {
          console.error(`Student not found with ID: ${routeStudentId}`);
          setStudent(null);
        }
      } catch (error) {
        console.error('Error loading student:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar la información del estudiante",
          variant: "destructive"
        });
        setStudent(null);
      } finally {
        setLoading(false);
      }
    };

    if (routeStudentId) {
      loadStudent();
    }
  }, [routeStudentId, toast]);

  const handleEditProfile = () => {
    if (student) {
      navigate('/students', { 
        state: { 
          action: 'editStudentFromProfile', 
          studentData: student
        } 
      });
    } else {
      toast({
        title: "Error",
        description: "No se pueden cargar los datos del estudiante para editar.",
        variant: "destructive"
      });
    }
  };
  
  const handleToggleStatus = async () => {
    if (!student) return;

    const newStatus = student.status === 'Activo' ? 'Bloqueado' : 'Activo';
    const newBlockReason = newStatus === 'Bloqueado' ? prompt("Por favor, ingrese el motivo del bloqueo:", student.blockReason || "Incumplimiento de normas.") : '';
    
    if (newStatus === 'Bloqueado' && newBlockReason === null) return;

    try {
      const response = await fetch(`${API_URL}/students/block/${student.studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blocked: newStatus === 'Bloqueado',
          block_reason: newBlockReason || ''
        }),
      });

      if (!response.ok) {
        throw new Error('Error al cambiar estado del estudiante');
      }

      const updatedStudent = {...student, status: newStatus, blockReason: newBlockReason || ''};
      setStudent(updatedStudent);

      toast({
        title: "Estado Actualizado",
        description: `El estado de ${student.name} ha cambiado a ${newStatus}. ${newStatus === 'Bloqueado' && newBlockReason ? `Motivo: ${newBlockReason}` : ''}`,
      });
    } catch (error) {
      console.error('Error toggling student status:', error);
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del estudiante",
        variant: "destructive"
      });
    }
  };

  const refreshLoans = async () => {
    if (student && student.studentId) {
      await loadStudentLoans(student.studentId);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <Loader2 className="w-16 h-16 mb-4 animate-spin text-primary" />
        <h2 className="text-2xl font-semibold">Cargando perfil del estudiante...</h2>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <AlertCircle className="w-16 h-16 mb-4 text-destructive" />
        <h2 className="text-2xl font-semibold">Estudiante no encontrado</h2>
        <p className="mb-4">No se pudo encontrar información para el ID: {routeStudentId}</p>
        <Button asChild variant="outline">
          <Link to="/students"><ArrowLeft className="mr-2 h-4 w-4" /> Volver a Estudiantes</Link>
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
          <Link to="/students"><ArrowLeft className="mr-2 h-4 w-4" /> Volver a Estudiantes</Link>
        </Button>
        <h1 className="text-3xl font-bold text-gradient-gold-teal">Perfil del Estudiante</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
        >
          <Card className="bg-card shadow-lg">
            <CardHeader className="items-center text-center">
              <div className="relative">
                <img  
                  className="w-32 h-32 rounded-full mb-4 border-4 border-primary shadow-md object-cover" 
                  // file deepcode ignore DOMXSS: <please specify a reason of ignoring this>
                  alt={`Avatar de ${student.name}`} src={student.avatar || "https://images.unsplash.com/photo-1698431048673-53ed1765ea07"} />
                <span className={`absolute bottom-4 right-2 block h-5 w-5 rounded-full border-2 border-card ${student.status === 'Activo' ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </div>
              <CardTitle className="text-2xl text-foreground">{student.name}</CardTitle>
              <CardDescription className="text-secondary">Matrícula: {student.studentId}</CardDescription>
              <CardDescription className="text-xs text-muted-foreground">ID Interno: {student.id}</CardDescription>
              <span className={`mt-2 px-3 py-1 text-sm font-semibold rounded-full ${
                  student.status === 'Activo' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {student.status}
              </span>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center text-muted-foreground"><Mail className="w-4 h-4 mr-2 text-primary" /> <span className="text-foreground">{student.email}</span></div>
              <div className="flex items-center text-muted-foreground"><Phone className="w-4 h-4 mr-2 text-primary" /> <span className="text-foreground">{student.phone}</span></div>
              <div className="flex items-center text-muted-foreground"><BookOpen className="w-4 h-4 mr-2 text-primary" /> <span className="text-foreground">{student.career}</span></div>
              <div className="flex items-center text-muted-foreground"><BarChart3 className="w-4 h-4 mr-2 text-primary" /> <span className="text-foreground">Cuatrimestre: {student.cuatrimestre}</span></div>
              <div className="flex items-center text-muted-foreground"><CalendarPlus className="w-4 h-4 mr-2 text-primary" /> <span className="text-foreground">Registrado: {new Date(student.registrationDate).toLocaleDateString()}</span></div>
              <div className="flex items-center text-muted-foreground"><AlertCircle className="w-4 h-4 mr-2 text-primary" /> <span className="text-foreground">Préstamos Activos/Vencidos: {student.loans}</span></div>
               <div className="flex items-center text-muted-foreground"><FingerprintIcon className="w-4 h-4 mr-2 text-primary" /> <span className="text-foreground">ID Huella: {student.fingerprintId}</span></div>
              {student.status === 'Bloqueado' && student.blockReason && (
                <div className="flex items-start text-muted-foreground pt-2 border-t border-border mt-2">
                    <FileText className="w-4 h-4 mr-2 text-destructive mt-1 flex-shrink-0" /> 
                    <div>
                        <span className="font-semibold text-destructive">Motivo de Bloqueo:</span>
                        <p className="text-foreground text-xs">{student.blockReason}</p>
                    </div>
                </div>
              )}
            </CardContent>
            <div className="p-6 pt-0 flex gap-2">
                <Button onClick={handleEditProfile} variant="outline" className="w-full border-custom-orange text-custom-orange hover:bg-custom-orange/10">
                    <Edit className="mr-2 h-4 w-4" /> Editar Perfil
                </Button>
                 <Button onClick={handleToggleStatus} variant="outline" className={`w-full ${student.status === 'Activo' ? 'border-red-500 text-red-500 hover:bg-red-500/10' : 'border-green-500 text-green-500 hover:bg-green-500/10'}`}>
                    {student.status === 'Activo' ? <UserX className="mr-2 h-4 w-4" /> : <UserCheck className="mr-2 h-4 w-4" />} 
                    {student.status === 'Activo' ? 'Bloquear' : 'Activar'}
                </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
        >
          <Card className="bg-card shadow-lg h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-gradient-gold-teal">Historial de Préstamos</CardTitle>
                  <CardDescription>Registro de todas las herramientas solicitadas por {student.name}.</CardDescription>
                </div>
                <Button onClick={refreshLoans} variant="outline" size="sm" disabled={loadingLoans}>
                  {loadingLoans ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertCircle className="w-4 h-4" />}
                  Actualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingLoans ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Cargando préstamos...</span>
                </div>
              ) : loanHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-custom-gold">Herramienta(s)</TableHead>
                        <TableHead className="text-custom-gold hidden sm:table-cell">Fecha</TableHead>
                        <TableHead className="text-custom-gold hidden sm:table-cell">Hora</TableHead>
                        <TableHead className="text-custom-gold">Fecha Límite</TableHead>
                        <TableHead className="text-custom-gold hidden md:table-cell">Fecha Devolución</TableHead>
                        <TableHead className="text-custom-gold text-right">Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loanHistory.map((loan) => (
                        <TableRow key={loan.id}>
                          <TableCell className="font-medium text-foreground max-w-xs">
                            <div className="truncate" title={loan.toolName}>{loan.toolName}</div>
                          </TableCell>
                          <TableCell className="text-muted-foreground hidden sm:table-cell">{loan.loanDate}</TableCell>
                          <TableCell className="text-muted-foreground hidden sm:table-cell">{loan.loanTime}</TableCell>
                          <TableCell className="text-muted-foreground">{new Date(loan.dueDate).toLocaleString('es-ES')}</TableCell>
                          <TableCell className="text-muted-foreground hidden md:table-cell">{loan.returnDate ? new Date(loan.returnDate).toLocaleString('es-ES') : 'N/A'}</TableCell>
                          <TableCell className="text-right">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${loan.statusClass}`}>
                              {loan.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground text-lg">Este estudiante no tiene historial de préstamos.</p>
                  <p className="text-muted-foreground text-sm mt-2">Los préstamos aparecerán aquí una vez que el estudiante solicite herramientas.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StudentProfilePage;