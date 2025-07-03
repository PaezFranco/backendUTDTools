


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Fingerprint, ScanLine, CalendarClock, UserCircle, PlusCircle, Trash2, AlertCircle, UserCog, CreditCard, Users, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const NewLoanPage = ({ currentUser }) => {
  // Estados existentes
  const [scannedStudentId, setScannedStudentId] = useState('');
  const [studentInfo, setStudentInfo] = useState(null);
  const [isScanningStudent, setIsScanningStudent] = useState(false);
  const [searchType, setSearchType] = useState('fingerprint'); // 'fingerprint' o 'studentId'
  
  const [scannedToolId, setScannedToolId] = useState('');
  const [isScanningTool, setIsScanningTool] = useState(false);
  const [loanItems, setLoanItems] = useState([]);
  
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [loanTime, setLoanTime] = useState('');
  
  // Nuevos estados para conectar con backend
  const [allStudents, setAllStudents] = useState([]);
  const [allTools, setAllTools] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [teachers, setTeachers] = useState([]); // Nuevo: maestros
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(''); // Nuevo: maestro a cargo
  const [configuredTimeHours, setConfiguredTimeHours] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
    const now = new Date();
    setLoanTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    const defaultDueDateTime = new Date(now.getTime() + 6 * 60 * 60 * 1000);
    setDueDate(defaultDueDateTime.toISOString().split('T')[0]);
    setDueTime(defaultDueDateTime.toTimeString().split(' ')[0].substring(0,5));
  }, []);


  // Mapear datos del backend al formato del frontend
  const loadInitialData = async () => {
  try {
    setIsLoading(true);
    
    // Cargar estudiantes
    try {
      const studentsResponse = await fetch(`${API_URL}/students`);
      if (studentsResponse.ok) {
        const studentsData = await studentsResponse.json();
        console.log('Estudiantes cargados:', studentsData.length);
        setAllStudents(studentsData);
      } else {
        console.error('Error al cargar estudiantes:', studentsResponse.status);
      }
    } catch (error) {
      console.error('Error en petición de estudiantes:', error);
    }

    // Cargar herramientas
    try {
      const toolsResponse = await fetch(`${API_URL}/tools`);
      if (toolsResponse.ok) {
        const toolsData = await toolsResponse.json();
        console.log('Herramientas cargadas:', toolsData.length);
        console.log('Primeras 3 herramientas:', toolsData.slice(0, 3));
        setAllTools(toolsData);
      } else {
        console.error('Error al cargar herramientas:', toolsResponse.status);
        toast({
          title: "Error",
          description: "No se pudieron cargar las herramientas",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error en petición de herramientas:', error);
      toast({
        title: "Error",
        description: "Error de conexión al cargar herramientas",
        variant: "destructive"
      });
    }

    // Cargar supervisores
    try {
      const supervisorsResponse = await fetch(`${API_URL}/supervisors`);
      if (supervisorsResponse.ok) {
        const supervisorsData = await supervisorsResponse.json();
        console.log('Supervisores cargados:', supervisorsData.length);
        setSupervisors(supervisorsData);
      } else {
        console.error('Error al cargar supervisores:', supervisorsResponse.status);
      }
    } catch (error) {
      console.error('Error en petición de supervisores:', error);
    }

    // Cargar maestros/profesores
    try {
      const teachersResponse = await fetch(`${API_URL}/teachers`);
      if (teachersResponse.ok) {
        const teachersData = await teachersResponse.json();
        console.log('Maestros cargados:', teachersData.length);
        setTeachers(teachersData);
      } else {
        // Si no hay endpoint de teachers, usar supervisors como fallback
        console.log('No hay endpoint de teachers, usando supervisors como maestros');
        setTeachers(supervisors);
      }
    } catch (error) {
      console.error('Error en petición de maestros:', error);
      // Usar supervisors como fallback
      setTeachers(supervisors);
    }

  } catch (error) {
    console.error('Error general loading initial data:', error);
    toast({
      title: "Error",
      description: "No se pudieron cargar todos los datos iniciales",
      variant: "destructive"
    });
  } finally {
    setIsLoading(false);
  }
};
  
  
  const mapBackendStudentToFrontend = (backendStudent) => {
    return {
      id: backendStudent._id,
      studentId: backendStudent.student_id,
      name: backendStudent.full_name || '',
      email: backendStudent.email,
      status: backendStudent.blocked ? 'Bloqueado' : 'Activo',
      career: backendStudent.career || '',
      cuatrimestre: backendStudent.semester || 1,
      avatar: backendStudent.avatar || 'https://images.unsplash.com/photo-1698431048673-53ed1765ea07',
      phone: backendStudent.phone || '',
      group: backendStudent.group || '',
      fingerprintId: backendStudent.registered_fingerprint ? 'Registrada' : `No registrada`,
      blockReason: backendStudent.block_reason || ''
    };
  };


  //   return {
  //     uniqueId: backendTool._id, // Usar _id como uniqueId
  //     specificName: backendTool.name,
  //     status: backendTool.available_quantity > 0 ? 'Disponible' : 'No Disponible',
  //     availableQuantity: backendTool.available_quantity,
  //     totalQuantity: backendTool.total_quantity,
  //     category: backendTool.category,
  //     barcode: backendTool.barcode,
  //     generalName: backendTool.general_name || backendTool.name // Agregar nombre general si existe
  //   };
  // };

  // const handleStudentSearch = async () => {
  //   if (!scannedStudentId.trim()) {
  //     toast({
  //       title: "Entrada Vacía",
  //       description: "Por favor ingrese un ID de estudiante o matrícula",
  //       variant: "destructive"
  //     });
  //     return;
  //   }

  //   setIsScanningStudent(true);
  //   const searchValue = scannedStudentId.trim();
    
  //   toast({ 
  //     title: searchType === 'fingerprint' ? "Verificando Huella..." : "Buscando Estudiante...", 
  //     description: searchType === 'fingerprint' ? "Simulando verificación de huella dactilar" : `Buscando matrícula: ${searchValue}` 
  //   });

  //   try {
  //     let foundStudent = null;
      
  //     if (searchType === 'fingerprint') {
  //       // Simular búsqueda por huella - buscar por student_id o _id
  //       foundStudent = allStudents.find(s => 
  //         s.student_id?.toLowerCase() === searchValue.toLowerCase() ||
  //         s._id === searchValue
  //       );
  //     } else {
  //       // Búsqueda específica por matrícula (student_id)
  //       foundStudent = allStudents.find(s => 
  //         s.student_id?.toLowerCase() === searchValue.toLowerCase()
  //       );
  //     }

  //     setTimeout(() => {
  //       if (foundStudent) {
  //         if (foundStudent.blocked) {
  //           toast({ 
  //             title: "Estudiante Bloqueado", 
  //             description: `${foundStudent.full_name} está bloqueado y no puede solicitar préstamos.${foundStudent.block_reason ? ' Motivo: ' + foundStudent.block_reason : ''}`, 
  //             variant: "destructive" 
  //           });
  //           setStudentInfo(null);
  //         } else {
  //           const mappedStudent = mapBackendStudentToFrontend(foundStudent);
  //           setStudentInfo(mappedStudent);
  //           toast({ 
  //             title: searchType === 'fingerprint' ? "¡Huella Verificada!" : "¡Estudiante Encontrado!", 
  //             description: `Estudiante: ${foundStudent.full_name} (${foundStudent.student_id})` 
  //           });
  //         }
  //       } else {
  //         toast({ 
  //           title: "Estudiante No Encontrado", 
  //           description: `No se encontró estudiante con ${searchType === 'fingerprint' ? 'huella/ID' : 'matrícula'}: '${searchValue}'`, 
  //           variant: "destructive" 
  //         });
  //         setStudentInfo(null);
  //       }
  //       setIsScanningStudent(false);
  //       setScannedStudentId('');
  //     }, 1500);

  //   } catch (error) {
  //     console.error('Error searching student:', error);
  //     toast({
  //       title: "Error",
  //       description: "Error al buscar el estudiante",
  //       variant: "destructive"
  //     });
  //     setIsScanningStudent(false);
  //   }
  // };
const mapBackendToolToFrontend = (backendTool) => {
  console.log('Mapeando herramienta del backend:', backendTool);
  
  const mappedTool = {
    uniqueId: backendTool._id, // Usar _id como uniqueId
    specificName: backendTool.name || backendTool.specific_name || 'Sin nombre',
    status: (backendTool.available_quantity && backendTool.available_quantity > 0) ? 'Disponible' : 'No Disponible',
    availableQuantity: backendTool.available_quantity || 0,
    totalQuantity: backendTool.total_quantity || backendTool.quantity || 0,
    category: backendTool.category || 'Sin categoría',
    barcode: backendTool.barcode || backendTool.code || '',
    generalName: backendTool.general_name || backendTool.name || 'Sin nombre general',
    // Campos adicionales que podrían ser útiles
    description: backendTool.description || '',
    brand: backendTool.brand || '',
    model: backendTool.model || ''
  };
  
  console.log('Herramienta mapeada:', mappedTool);
  return mappedTool;
};
const handleStudentSearch = async () => {
  if (!scannedStudentId.trim()) {
    toast({
      title: "Entrada Vacía",
      description: "Por favor ingrese un ID de estudiante o matrícula",
      variant: "destructive"
    });
    return;
  }

  setIsScanningStudent(true);
  const searchValue = scannedStudentId.trim();
  
  toast({ 
    title: searchType === 'fingerprint' ? "Verificando Huella..." : "Buscando Estudiante...", 
    description: searchType === 'fingerprint' ? "Simulando verificación de huella dactilar" : `Buscando matrícula: ${searchValue}` 
  });

  try {
    let foundStudent = null;
    
    if (searchType === 'fingerprint') {
      // Para huella, primero buscar por student_id, luego por coincidencia parcial
      foundStudent = allStudents.find(s => 
        s.student_id?.toLowerCase() === searchValue.toLowerCase() ||
        s._id === searchValue ||
        s.full_name?.toLowerCase().includes(searchValue.toLowerCase())
      );
    } else {
      // Búsqueda específica por matrícula (student_id)
      foundStudent = allStudents.find(s => 
        s.student_id?.toLowerCase() === searchValue.toLowerCase()
      );
    }

    setTimeout(() => {
      if (foundStudent) {
        if (foundStudent.blocked) {
          toast({ 
            title: "Estudiante Bloqueado", 
            description: `${foundStudent.full_name} está bloqueado y no puede solicitar préstamos.${foundStudent.block_reason ? ' Motivo: ' + foundStudent.block_reason : ''}`, 
            variant: "destructive" 
          });
          setStudentInfo(null);
        } else {
          const mappedStudent = mapBackendStudentToFrontend(foundStudent);
          setStudentInfo(mappedStudent);
          toast({ 
            title: searchType === 'fingerprint' ? "¡Huella Verificada!" : "¡Estudiante Encontrado!", 
            description: `Estudiante: ${foundStudent.full_name} (${foundStudent.student_id})` 
          });
        }
      } else {
        toast({ 
          title: "Estudiante No Encontrado", 
          description: `No se encontró estudiante con ${searchType === 'fingerprint' ? 'huella/ID' : 'matrícula'}: '${searchValue}'`, 
          variant: "destructive" 
        });
        setStudentInfo(null);
      }
      setIsScanningStudent(false);
      setScannedStudentId('');
    }, 1500);

  } catch (error) {
    console.error('Error searching student:', error);
    toast({
      title: "Error",
      description: "Error al buscar el estudiante",
      variant: "destructive"
    });
    setIsScanningStudent(false);
  }
};

  //   if (!scannedToolId.trim()) {
  //     toast({ 
  //       title: "Entrada Vacía", 
  //       description: "Por favor ingrese un ID de herramienta para escanear.", 
  //       variant: "destructive"
  //     });
  //     return;
  //   }

  //   setIsScanningTool(true);
  //   toast({ title: "Escaneando Herramienta...", description: `Buscando ID: ${scannedToolId}` });

  //   try {
  //     const searchValue = scannedToolId.trim();
  //     // Buscar por _id, barcode, name, o coincidencia parcial en name
  //     const foundTool = allTools.find(t => {
  //       return (
  //         t._id === searchValue || 
  //         t.barcode?.toLowerCase() === searchValue.toLowerCase() ||
  //         t.name?.toLowerCase() === searchValue.toLowerCase() ||
  //         t.name?.toLowerCase().includes(searchValue.toLowerCase())
  //       );
  //     });

  //     setTimeout(() => {
  //       if (foundTool) {
  //         // Verificar si ya está en la lista (usar _id para comparar)
  //         if (loanItems.some(item => item.uniqueId === foundTool._id)) {
  //           toast({ 
  //             title: "Herramienta ya Agregada", 
  //             description: `${foundTool.name} ya está en la lista.`, 
  //             variant: "default" 
  //           });
  //         } else if (foundTool.available_quantity > 0) {
  //           const mappedTool = mapBackendToolToFrontend(foundTool);
  //           setLoanItems(prev => [...prev, mappedTool]);
  //           toast({ 
  //             title: "Herramienta Agregada", 
  //             description: `${foundTool.name} añadida al préstamo.` 
  //           });
  //         } else {
  //           toast({ 
  //             title: "Herramienta no Disponible", 
  //             description: `${foundTool.name} no tiene stock disponible.`, 
  //             variant: "destructive" 
  //           });
  //         }
  //       } else {
  //         toast({ 
  //           title: "Herramienta No Encontrada", 
  //           description: `No se encontró herramienta con ID '${scannedToolId}'.`, 
  //           variant: "destructive" 
  //         });
  //       }
  //       setIsScanningTool(false);
  //       setScannedToolId('');
  //     }, 1000);

  //   } catch (error) {
  //     console.error('Error searching tool:', error);
  //     toast({
  //       title: "Error",
  //       description: "Error al buscar la herramienta",
  //       variant: "destructive"
  //     });
  //     setIsScanningTool(false);
  //   }
  // };
const handleSimulateToolScan = async () => {
  if (!scannedToolId.trim()) {
    toast({ 
      title: "Entrada Vacía", 
      description: "Por favor ingrese un ID de herramienta para escanear.", 
      variant: "destructive"
    });
    return;
  }

  setIsScanningTool(true);
  const searchValue = scannedToolId.trim().toLowerCase();

  toast({ 
    title: "Escaneando Herramienta...", 
    description: `Buscando: ${searchValue}` 
  });

  try {
    console.log('Todas las herramientas disponibles:', allTools);

    const foundTool = allTools.find(t => {
      const matchByUniqueId = t.uniqueId?.toLowerCase() === searchValue;
      const matchBySpecificName = t.specificName?.toLowerCase() === searchValue;
      const matchByPartialSpecificName = t.specificName?.toLowerCase().includes(searchValue);
      
      return matchByUniqueId || matchBySpecificName || matchByPartialSpecificName;
    });

    setTimeout(() => {
      if (foundTool) {
        const alreadyAdded = loanItems.some(item => item.uniqueId === foundTool.uniqueId);

        if (alreadyAdded) {
          toast({ 
            title: "Herramienta ya Agregada", 
            description: `${foundTool.specificName} ya está en la lista.`, 
            variant: "default" 
          });
        } else if (foundTool.available_quantity > 0) {
          const mappedTool = mapBackendToolToFrontend(foundTool);
          setLoanItems(prev => [...prev, mappedTool]);

          toast({ 
            title: "¡Herramienta Agregada!", 
            description: `${foundTool.specificName} añadida al préstamo.`,
            variant: "default"
          });
        } else {
          toast({ 
            title: "Herramienta no Disponible", 
            description: `${foundTool.specificName} no tiene stock disponible.`, 
            variant: "destructive" 
          });
        }
      } else {
        toast({ 
          title: "Herramienta No Encontrada", 
          description: `No se encontró herramienta con: '${searchValue}'. Verifique el ID o nombre.`,
          variant: "destructive"
        });

        // Mostrar primeras 3 como referencia
        if (allTools.length > 0) {
          console.log('Primeras 3 herramientas disponibles para referencia:');
          allTools.slice(0, 3).forEach(tool => {
            console.log(`- ${tool.specificName || tool.generalName || 'Sin nombre'} (ID: ${tool._id || 'N/A'}, Código: ${tool.uniqueId || 'N/A'})`);
          });
        }
      }

      setIsScanningTool(false);
      setScannedToolId('');
    }, 1000);

  } catch (error) {
    console.error('Error searching tool:', error);
    toast({
      title: "Error",
      description: "Error al buscar la herramienta",
      variant: "destructive"
    });
    setIsScanningTool(false);
    setScannedToolId('');
  }
};



  const removeLoanItem = (toolId) => {
    setLoanItems(prev => prev.filter(item => item.uniqueId !== toolId));
    toast({ title: "Herramienta Eliminada", description: "Se quitó la herramienta de la lista." });
  };

  const handleConfirmLoan = async () => {
    if (!studentInfo) {
      toast({ title: "Error", description: "Debe seleccionar un estudiante.", variant: "destructive" });
      return;
    }
    if (loanItems.length === 0) {
      toast({ title: "Error", description: "Debe agregar al menos una herramienta.", variant: "destructive" });
      return;
    }
    if (!dueDate || !dueTime) {
      toast({ title: "Error", description: "Debe especificar la fecha y hora límite de devolución.", variant: "destructive" });
      return;
    }
    if (!selectedSupervisor) {
      toast({ title: "Error", description: "Debe seleccionar un supervisor a cargo.", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      // Preparar datos para el backend
      const loanData = {
        student_code: studentInfo.studentId,
        supervisor_id: selectedSupervisor,
        teacher_id: selectedTeacher || null, // Maestro a cargo (opcional)
        tools: loanItems.map(item => ({
          tool_id: item.uniqueId,
          quantity: 1 // Por ahora asumimos cantidad 1
        })),
        configured_time_hours: configuredTimeHours,
        estimated_return_date: new Date(`${dueDate}T${dueTime}:00`).toISOString(),
        loan_date: new Date().toISOString(), // Hora actual del préstamo
        admin_id: currentUser?._id || currentUser?.id // ID del admin que registra
      };

      const response = await fetch(`${API_URL}/loans/create-with-validation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loanData)
      });

      const result = await response.json();

      if (response.ok) {
        const supervisorName = supervisors.find(s => s._id === selectedSupervisor)?.full_name || 'N/A';
        const teacherName = selectedTeacher ? (teachers.find(t => t._id === selectedTeacher)?.full_name || 'N/A') : 'N/A';
        
        toast({
          title: "¡Préstamo Confirmado!",
          description: `${loanItems.length} herramienta(s) prestada(s) a ${studentInfo.name}. Supervisor: ${supervisorName}${teacherName !== 'N/A' ? `, Maestro: ${teacherName}` : ''}.`,
          duration: 7000
        });

        // Reset form
        resetForm();
        
        // Recargar datos para actualizar stock
        await loadInitialData();

      } else {
        throw new Error(result.message || 'Error al crear el préstamo');
      }

    }  catch (error) {
  console.error('Error creating loan:', error);

  if (error.response) {
    const errorText = await error.response.text();
    console.error('Respuesta del servidor:', errorText);
  }

  toast({
    title: "Error",
    description: error.message || "No se pudo confirmar el préstamo",
    variant: "destructive"
  });
}

  };

  const resetForm = () => {
    setScannedStudentId('');
    setStudentInfo(null);
    setScannedToolId('');
    setLoanItems([]);
    setSelectedSupervisor('');
    setSelectedTeacher('');
    const now = new Date();
    const defaultDueDateTime = new Date(now.getTime() + configuredTimeHours * 60 * 60 * 1000);
    setDueDate(defaultDueDateTime.toISOString().split('T')[0]);
    setDueTime(defaultDueDateTime.toTimeString().split(' ')[0].substring(0,5));
    setLoanTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  // Actualizar fecha límite cuando cambie el tiempo configurado
  useEffect(() => {
    if (configuredTimeHours) {
      const now = new Date();
      const newDueDateTime = new Date(now.getTime() + configuredTimeHours * 60 * 60 * 1000);
      setDueDate(newDueDateTime.toISOString().split('T')[0]);
      setDueTime(newDueDateTime.toTimeString().split(' ')[0].substring(0,5));
    }
  }, [configuredTimeHours]);

  return (
    <motion.div 
      className="space-y-8 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gradient-gold-teal text-center">Registrar Nuevo Préstamo</h1>

      {/* Student Search Section */}
      <Card className="bg-card shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-primary flex items-center">
            <UserCircle className="mr-2 h-6 w-6" /> Información del Estudiante
          </CardTitle>
          <CardDescription>Busque al estudiante por huella dactilar o matrícula.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-custom-gold">Tipo de Búsqueda</Label>
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="bg-input border-custom-gold/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fingerprint">
                    <div className="flex items-center">
                      <Fingerprint className="mr-2 h-4 w-4" />
                      Por Huella Dactilar
                    </div>
                  </SelectItem>
                  <SelectItem value="studentId">
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Por Matrícula
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="student-search-id" className="text-custom-gold">
                {searchType === 'fingerprint' ? 'ID para Simular Huella' : 'Matrícula del Estudiante'}
              </Label>
              <div className="flex items-end gap-2">
                <Input 
                  id="student-search-id" 
                  placeholder={searchType === 'fingerprint' ? "Ingrese ID para simular huella" : "Ingrese matrícula del estudiante"} 
                  value={scannedStudentId}
                  onChange={(e) => setScannedStudentId(e.target.value)}
                  className="bg-input border-custom-gold/30 focus:border-custom-gold" 
                  onKeyPress={(e) => e.key === 'Enter' && handleStudentSearch()}
                />
                <Button onClick={handleStudentSearch} disabled={isScanningStudent || isLoading} className="min-w-[150px]">
                  {searchType === 'fingerprint' ? (
                    <Fingerprint className={`mr-2 h-5 w-5 ${isScanningStudent ? 'animate-ping' : ''}`} />
                  ) : (
                    <CreditCard className={`mr-2 h-5 w-5 ${isScanningStudent ? 'animate-ping' : ''}`} />
                  )}
                  {isScanningStudent ? 'Buscando...' : (searchType === 'fingerprint' ? 'Verificar' : 'Buscar ')}
                </Button>
              </div>
            </div>
          </div>
          
          {studentInfo && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: "auto" }} 
              transition={{ duration: 0.3}}
              className="p-4 border border-primary/30 rounded-md bg-primary/5"
            >
              <div className="flex items-center gap-4">
                <img  
                  className="w-20 h-20 rounded-full border-2 border-primary object-cover" 
                  alt={`Avatar de ${studentInfo.name}`} 
                  src={studentInfo.avatar} 
                />
                <div className="flex-grow">
                  <p className="font-semibold text-lg text-foreground">{studentInfo.name}</p>
                  <p className="text-sm text-muted-foreground">Matrícula: {studentInfo.studentId} | {studentInfo.career}</p>
                  <p className="text-sm text-muted-foreground">Cuatrimestre: {studentInfo.cuatrimestre} | Grupo: {studentInfo.group}</p>
                  <p className={`text-sm font-bold ${studentInfo.status === 'Activo' ? 'text-green-500' : 'text-red-500'}`}>
                    Estado: {studentInfo.status}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Tools Scan Section */}
      {studentInfo && studentInfo.status === 'Activo' && (
        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center">
              <ScanLine className="mr-2 h-6 w-6" /> Escanear Herramientas
            </CardTitle>
            <CardDescription>Agregue herramientas al préstamo escaneando su código de barras o ingresando su ID.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end gap-2">
              <div className="flex-grow">
                <Label htmlFor="tool-scan-id" className="text-custom-gold">ID o Código de Herramienta</Label>
                <Input 
                  id="tool-scan-id" 
                  placeholder="Ingrese ID o código de barras de herramienta" 
                  value={scannedToolId}
                  onChange={(e) => setScannedToolId(e.target.value)}
                  className="bg-input border-custom-gold/30 focus:border-custom-gold" 
                  onKeyPress={(e) => e.key === 'Enter' && handleSimulateToolScan()}
                />
              </div>
              <Button onClick={handleSimulateToolScan} disabled={isScanningTool || isLoading} className="min-w-[150px]">
                <PlusCircle className={`mr-2 h-5 w-5 ${isScanningTool ? 'animate-ping' : ''}`} />
                {isScanningTool ? 'Agregando...' : 'Agregar Herramienta'}
              </Button>
            </div>
            
            {loanItems.length > 0 && (
              <div className="mt-4 rounded-lg border border-border shadow-sm bg-background overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-custom-gold">ID Herramienta</TableHead>
                      <TableHead className="text-custom-gold">Nombre</TableHead>
                      <TableHead className="text-custom-gold">Stock Disponible</TableHead>
                      <TableHead className="text-custom-gold text-right">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loanItems.map(item => (
                      <TableRow key={item.uniqueId}>
                        <TableCell className="font-medium text-foreground">{item.uniqueId}</TableCell>
                        <TableCell className="text-muted-foreground">{item.specificName}</TableCell>
                        <TableCell className="text-muted-foreground">{item.availableQuantity}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeLoanItem(item.uniqueId)} 
                            className="text-destructive hover:text-destructive/80"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {loanItems.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-2">Ninguna herramienta agregada aún.</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Loan Details Section */}
      {studentInfo && studentInfo.status === 'Activo' && loanItems.length > 0 && (
        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center">
              <CalendarClock className="mr-2 h-6 w-6" /> Detalles del Préstamo
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-custom-gold">Hora de Préstamo</Label>
              <Input value={loanTime} readOnly className="bg-muted/50 border-custom-gold/30"/>
            </div>
            <div>
              <Label htmlFor="admin-in-charge" className="text-custom-gold">Admin a Cargo</Label>
              <div className="flex items-center p-2.5 rounded-md bg-muted/50 border border-custom-gold/30">
                <UserCog className="w-5 h-5 mr-2 text-primary" />
                <span className="text-foreground">{currentUser?.name || 'N/A'}</span>
              </div>
            </div>
            <div>
              <Label htmlFor="supervisor-select" className="text-custom-gold">Supervisor a Cargo</Label>
              <Select value={selectedSupervisor} onValueChange={setSelectedSupervisor}>
                <SelectTrigger className="bg-input border-custom-gold/30">
                  <SelectValue placeholder="Seleccione un supervisor">
                    {selectedSupervisor && (
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        {supervisors.find(s => s._id === selectedSupervisor)?.full_name || 'Supervisor'}
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {supervisors.map(supervisor => (
                    <SelectItem key={supervisor._id} value={supervisor._id}>
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        {supervisor.full_name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div>
              <Label htmlFor="teacher-select" className="text-custom-gold">Maestro a Cargo (Opcional)</Label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger className="bg-input border-custom-gold/30">
                  <SelectValue placeholder="Seleccione un maestro (opcional)">
                    {selectedTeacher && (
                      <div className="flex items-center">
                        <GraduationCap className="mr-2 h-4 w-4" />
                        {teachers.find(t => t._id === selectedTeacher)?.full_name || 'Maestro'}
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <div className="flex items-center text-muted-foreground">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Sin maestro asignado
                    </div>
                  </SelectItem>

                  {teachers.map(teacher => (
                    <SelectItem key={teacher._id} value={teacher._id}>
                      <div className="flex items-center">
                        <GraduationCap className="mr-2 h-4 w-4" />
                        {teacher.full_name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="configured-time" className="text-custom-gold">Tiempo Configurado (Horas)</Label>
              <Input 
                id="configured-time" 
                type="number" 
                min="1" 
                max="24" 
                value={configuredTimeHours} 
                onChange={e => setConfiguredTimeHours(parseInt(e.target.value) || 6)} 
                className="bg-input border-custom-gold/30 focus:border-custom-gold"
              />
            </div>
            <div>
              <Label htmlFor="due-date" className="text-custom-gold">Fecha Límite Devolución</Label>
              <Input 
                id="due-date" 
                type="date" 
                value={dueDate} 
                onChange={e => setDueDate(e.target.value)} 
                className="bg-input border-custom-gold/30 focus:border-custom-gold"
              />
            </div>
            <div>
              <Label htmlFor="due-time" className="text-custom-gold">Hora Límite Devolución</Label>
              <Input 
                id="due-time" 
                type="time" 
                value={dueTime} 
                onChange={e => setDueTime(e.target.value)} 
                className="bg-input border-custom-gold/30 focus:border-custom-gold"
              />
            </div>
          </CardContent>
          <div className="p-6 pt-2 flex justify-end">
            <Button 
              onClick={handleConfirmLoan} 
              size="lg" 
              className="min-w-[200px]" 
              disabled={isLoading}
            >
              {isLoading ? 'Confirmando...' : 'Confirmar Préstamo'}
            </Button>
          </div>
        </Card>
      )}

      {!studentInfo && (
        <div className="text-center py-10">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Por favor, busque un estudiante para iniciar un préstamo.</p>
        </div>
      )}
      
      {studentInfo && studentInfo.status === 'Bloqueado' && (
        <div className="text-center py-10">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-500 font-semibold">El estudiante {studentInfo.name} está bloqueado.</p>
          <p className="text-muted-foreground">No puede solicitar préstamos hasta que se resuelva su situación.</p>
        </div>
      )}
    </motion.div>
  );
};

export default NewLoanPage;