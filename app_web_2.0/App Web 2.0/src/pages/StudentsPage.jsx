

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle, Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import StudentForm from '@/components/StudentForm';
import StudentsTable from '@/components/StudentsTable';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const predefinedCareers = [
  'Ing. en Mecatrónica',
  'Ing. en Tecnologías de la Información',
  'Ing. en Energías Renovables',
  'Ing. en Logística Internacional',
  'Ing. en Desarrollo y Gestión de Software',
  'Ing. en Nanotecnología',
  'Lic. en Administración y Gestión Empresarial',
  'TSU. en Procesos Industriales',
  'Otra',
];

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Función para mapear datos del backend al formato del frontend
  const mapBackendToFrontend = (backendStudent) => {
    return {
      id: backendStudent._id,
      studentId: backendStudent.student_id,
      name: backendStudent.full_name || '',
      email: backendStudent.email,
      status: backendStudent.blocked ? 'Bloqueado' : 'Activo',
      loans: 0, // Este campo no existe en el backend, se mantiene en 0
      career: backendStudent.career || '',
      cuatrimestre: backendStudent.semester || 1,
      phone: backendStudent.phone || '',
      registrationDate: backendStudent.registration_date ? new Date(backendStudent.registration_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      blockReason: backendStudent.block_reason || '',
      fingerprintId: backendStudent.registered_fingerprint ? 'Registrada' : '',
      group: backendStudent.group || ''
    };
  };

  // Función para mapear datos del frontend al formato del backend
  const mapFrontendToBackend = (frontendStudent) => {
    return {
      student_id: frontendStudent.studentId,
      full_name: frontendStudent.name,
      email: frontendStudent.email,
      career: frontendStudent.career,
      semester: frontendStudent.cuatrimestre,
      phone: frontendStudent.phone,
      group: frontendStudent.group || '',
      blocked: frontendStudent.status === 'Bloqueado',
      block_reason: frontendStudent.blockReason || '',
      is_profile_complete: true
    };
  };

  // Cargar estudiantes desde la API
  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/students`);
      if (!response.ok) {
        throw new Error('Error al cargar estudiantes');
      }
      const backendStudents = await response.json();
      const mappedStudents = backendStudents.map(mapBackendToFrontend);
      setStudents(mappedStudents);
    } catch (error) {
      console.error('Error loading students:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los estudiantes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const openModal = useCallback((student = null) => {
    if (student && (student.isCompletingRegistration || student.isEditingFromProfile)) {
      setCurrentStudent(student);
    } else {
      setCurrentStudent(student ? { ...student } : { 
        id: '', 
        studentId: '', 
        name: '', 
        email: '', 
        status: 'Activo', 
        loans: 0, 
        career: '', 
        cuatrimestre: 1, 
        phone: '', 
        registrationDate: new Date().toISOString().split('T')[0], 
        blockReason: '', 
        fingerprintId: '',
        group: ''
      });
    }
    setIsModalOpen(true);
  }, []);

  useEffect(() => {
    const processLocationState = () => {
      if (location.state?.action === 'completeRegistration' && location.state?.pendingStudentData) {
        const { pendingStudentData } = location.state;
        openModal({
          studentId: pendingStudentData.studentId, 
          name: pendingStudentData.name,
          email: '', 
          status: 'Activo', 
          loans: 0, 
          career: '', 
          cuatrimestre: 1, 
          phone: '', 
          registrationDate: new Date().toISOString().split('T')[0], 
          blockReason: '',
          fingerprintId: '',
          group: '',
          isCompletingRegistration: true 
        });
        navigate(location.pathname, { replace: true, state: {} });
      } else if (location.state?.action === 'editStudentFromProfile' && location.state?.studentData) {
        const { studentData } = location.state;
        openModal({ ...studentData, isEditingFromProfile: true });
        navigate(location.pathname, { replace: true, state: {} });
      }
    };
    processLocationState();
  }, [location.state, navigate, openModal]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm) ||
    student.email.toLowerCase().includes(searchTerm) ||
    String(student.studentId).toLowerCase().includes(searchTerm) ||
    student.career?.toLowerCase().includes(searchTerm)
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentStudent(null);
    setSubmitting(false);
  };
  
  const handleSubmit = async (submittedStudent) => {
    if (!submittedStudent.name || !submittedStudent.email || !submittedStudent.career || !submittedStudent.studentId) {
      toast({ 
        title: "Error", 
        description: "Matrícula, Nombre, email y carrera son obligatorios.", 
        variant: "destructive" 
      });
      return;
    }

    setSubmitting(true);

    try {
      const backendData = mapFrontendToBackend(submittedStudent);
      const isEditing = submittedStudent.id && submittedStudent.id !== '';

      if (isEditing) {
        // Actualizar estudiante existente
        const response = await fetch(`${API_URL}/students/${submittedStudent.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(backendData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al actualizar estudiante');
        }

        toast({ 
          title: "Estudiante Actualizado", 
          description: `${submittedStudent.name} ha sido actualizado exitosamente.`
        });
      } else {
        // Crear nuevo estudiante
        const response = await fetch(`${API_URL}/students`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(backendData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al crear estudiante');
        }

        toast({ 
          title: "Estudiante Agregado", 
          description: `${submittedStudent.name} ha sido agregado con matrícula ${submittedStudent.studentId}.`
        });
      }

      // Recargar la lista de estudiantes
      await loadStudents();
      closeModal();

    } catch (error) {
      console.error('Error submitting student:', error);
      toast({
        title: "Error",
        description: error.message || "Error al procesar la solicitud",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const openDeleteConfirm = (student) => {
    setStudentToDelete(student);
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setStudentToDelete(null);
    setIsDeleteConfirmOpen(false);
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;

    try {
      const response = await fetch(`${API_URL}/students/${studentToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar estudiante');
      }

      toast({ 
        title: "Estudiante Eliminado", 
        description: `${studentToDelete.name} ha sido eliminado.`
      });

      // Recargar la lista de estudiantes
      await loadStudents();
      closeDeleteConfirm();

    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el estudiante",
        variant: "destructive"
      });
    }
  };

  const toggleStudentStatus = async (studentId) => {
    try {
      const student = students.find(s => s.id === studentId);
      if (!student) return;

      const newStatus = student.status === 'Activo' ? 'Bloqueado' : 'Activo';
      const blockReason = newStatus === 'Bloqueado' ? 'Bloqueado manualmente por admin.' : '';

      const response = await fetch(`${API_URL}/students/block/${student.studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blocked: newStatus === 'Bloqueado',
          block_reason: blockReason
        }),
      });

      if (!response.ok) {
        throw new Error('Error al cambiar estado del estudiante');
      }

      toast({ 
        title: "Estado Actualizado", 
        description: `El estado de ${student.name} ha cambiado a ${newStatus}.`
      });

      // Recargar la lista de estudiantes
      await loadStudents();

    } catch (error) {
      console.error('Error toggling student status:', error);
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del estudiante",
        variant: "destructive"
      });
    }
  };

  const viewStudentProfile = (studentInternalId) => {
    navigate(`/students/${studentInternalId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando estudiantes...</span>
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
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gradient-gold-teal">Gestión de Estudiantes</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre, matrícula..."
              className="pl-10 w-full sm:w-64 bg-input border-custom-gold/30 focus:border-custom-gold"
              onChange={handleSearch}
              value={searchTerm}
            />
          </div>
          <Button onClick={() => openModal()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-5 w-5" />
            Nuevo
          </Button>
        </div>
      </div>

      <StudentsTable
        students={filteredStudents}
        onViewProfile={viewStudentProfile}
        onToggleStatus={toggleStudentStatus}
        onEdit={openModal}
        onDelete={openDeleteConfirm}
      />
      
      {filteredStudents.length === 0 && !loading && (
        <p className="text-center text-muted-foreground py-8">No se encontraron estudiantes.</p>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-custom-gold/50">
          <DialogHeader>
            <DialogTitle className="text-gradient-gold-teal">
              {currentStudent?.isCompletingRegistration ? 'Completar Registro de Estudiante' : 
               (currentStudent?.id ? 'Editar Estudiante' : 'Agregar Nuevo Estudiante')}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {currentStudent?.isCompletingRegistration ? 
               `Completando datos para ${currentStudent.name} (${currentStudent.studentId}).` : 
               'Completa o modifica los detalles del estudiante.'}
            </DialogDescription>
          </DialogHeader>
          {currentStudent && (
            <StudentForm
              studentData={currentStudent}
              onSubmit={handleSubmit}
              onCancel={closeModal}
              predefinedCareers={predefinedCareers}
              isEditing={!!currentStudent.id}
              isCompletingRegistration={currentStudent?.isCompletingRegistration}
              isSubmitting={submitting}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md bg-card border-destructive/50">
          <DialogHeader>
            <DialogTitle className="text-destructive">Confirmar Eliminación</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              ¿Estás seguro de que quieres eliminar a <span className="font-semibold text-foreground">{studentToDelete?.name}</span>? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeDeleteConfirm} className="border-muted-foreground text-muted-foreground hover:bg-muted/10">
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteStudent}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default StudentsPage;