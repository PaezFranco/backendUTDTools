
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Search, User, Wrench, Clock, Mail, Phone, UserX, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const initialOverdueItems = [
  { loanId: 'L002', studentId: 'S001', studentName: 'Ana García López', studentEmail: 'ana.garcia@utd.edu.mx', studentPhone: '871-123-4567', toolName: 'Llave Inglesa Stanley', toolId: 'T005', dueDate: '2025-06-14 16:30', daysOverdue: 0, adminLoan: 'Daniel Morales' }, // Assuming today is 2025-06-14
  { loanId: 'L008', studentId: 'S003', studentName: 'Sofía Hernández Pérez', studentEmail: 'sofia.hernandez@utd.edu.mx', studentPhone: '871-345-6789', toolName: 'Taladro Percutor Bosch', toolId: 'T001', dueDate: '2025-06-12 10:00', daysOverdue: 2, adminLoan: 'Laura Vargas' },
  { loanId: 'L015', studentId: 'S004', studentName: 'Carlos Sánchez Gómez', studentEmail: 'carlos.sanchez@utd.edu.mx', studentPhone: '871-456-7890', toolName: 'Sierra Circular Skil', toolId: 'T002', dueDate: '2025-06-10 18:00', daysOverdue: 4, adminLoan: 'Daniel Morales' },
];

// Function to calculate days overdue dynamically
const calculateDaysOverdue = (dueDateStr) => {
  const due = new Date(dueDateStr);
  const today = new Date('2025-06-14T12:00:00'); // Fixed current date for consistent simulation
  if (due >= today) return 0;
  const diffTime = Math.abs(today - due);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const OverdueItemsPage = () => {
  const [overdueItems, setOverdueItems] = useState(
    initialOverdueItems.map(item => ({...item, daysOverdue: calculateDaysOverdue(item.dueDate)}))
                     .filter(item => item.daysOverdue > 0) // Only show truly overdue items
                     .sort((a,b) => b.daysOverdue - a.daysOverdue)
  );
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredOverdueItems = overdueItems.filter(item =>
    item.studentName.toLowerCase().includes(searchTerm) ||
    item.toolName.toLowerCase().includes(searchTerm) ||
    item.studentId.toLowerCase().includes(searchTerm) ||
    item.toolId.toLowerCase().includes(searchTerm)
  );

  const handleNotifyStudent = (studentName, toolName) => {
    toast({
      title: "Notificación Simulada",
      description: `Se ha enviado una notificación (simulada) a ${studentName} por la devolución pendiente de ${toolName}.`,
      duration: 5000,
    });
  };
  
  const handleBlockStudent = (studentId, studentName) => {
    // In a real app, this would update student status in the main students list
    toast({
      title: "Bloqueo Simulado",
      description: `El estudiante ${studentName} (ID: ${studentId}) ha sido marcado para bloqueo (simulado).`,
      variant: "destructive",
      duration: 5000,
    });
  };


  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gradient-gold-teal flex items-center">
          <AlertTriangle className="mr-3 h-8 w-8 text-destructive" />
          Materiales No Devueltos / Vencidos
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por estudiante o herramienta..."
            className="pl-10 w-full sm:w-72 bg-input border-custom-gold/30 focus:border-custom-gold"
            onChange={handleSearch}
            value={searchTerm}
          />
        </div>
      </div>

      <motion.div 
        className="rounded-lg border border-destructive/30 shadow-sm bg-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50 border-b-destructive/30">
              <TableHead className="text-destructive">Estudiante</TableHead>
              <TableHead className="text-destructive">Herramienta</TableHead>
              <TableHead className="text-destructive hidden md:table-cell">Fecha Límite</TableHead>
              <TableHead className="text-destructive text-center">Días Vencido</TableHead>
              <TableHead className="text-destructive hidden lg:table-cell">Admin Préstamo</TableHead>
              <TableHead className="text-destructive text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOverdueItems.map((item) => (
              <TableRow key={item.loanId} className="hover:bg-red-500/5 transition-colors">
                <TableCell className="font-medium text-foreground">
                  <Link to={`/students/${item.studentId}`} className="hover:underline flex items-center">
                    <User className="inline h-4 w-4 mr-1 text-primary"/> {item.studentName} ({item.studentId})
                  </Link>
                </TableCell>
                <TableCell className="text-foreground">
                  <Wrench className="inline h-4 w-4 mr-1 text-primary"/> {item.toolName} ({item.toolId})
                </TableCell>
                <TableCell className="text-muted-foreground hidden md:table-cell">
                  <Clock className="inline h-4 w-4 mr-1 text-muted-foreground"/> 
                  {new Date(item.dueDate).toLocaleString()}
                </TableCell>
                <TableCell className="text-center font-semibold text-destructive">{item.daysOverdue}</TableCell>
                <TableCell className="text-muted-foreground hidden lg:table-cell">{item.adminLoan}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleNotifyStudent(item.studentName, item.toolName)} className="text-custom-orange hover:text-custom-orange/80" title="Notificar Estudiante">
                    <Mail className="h-4 w-4" />
                  </Button>
                   <Button variant="ghost" size="icon" onClick={() => toast({title: "Llamada Simulada", description: `Simulando llamada a ${item.studentPhone} para ${item.studentName}.`})} className="text-blue-500 hover:text-blue-400" title="Llamar (Simulado)">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleBlockStudent(item.studentId, item.studentName)} className="text-destructive hover:text-destructive/80" title="Bloquear Estudiante (Simulado)">
                    <UserX className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
      {filteredOverdueItems.length === 0 && (
        <Card className="bg-card">
          <CardContent className="pt-6">
            <p className="text-center text-green-600 font-semibold py-8 text-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 mr-2 text-green-500"/> ¡Excelente! No hay materiales vencidos por el momento.
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default OverdueItemsPage;
