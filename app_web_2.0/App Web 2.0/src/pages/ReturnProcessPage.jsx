
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Fingerprint, ScanLine, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const mockStudentData = {
  'S001': { 
    name: 'Ana García López', 
    activeLoans: [
      { id: 'L001', toolName: 'Taladro Percutor Bosch', toolId: 'T001', dueDate: '2025-06-15 15:00', status: 'Pendiente' },
      { id: 'L002', toolName: 'Llave Inglesa Stanley', toolId: 'T005', dueDate: '2025-06-14 16:30', status: 'Vencido' },
    ]
  },
  'S002': {
    name: 'Luis Martínez Rodríguez',
    activeLoans: [
      { id: 'L003', toolName: 'Sierra Circular Skil', toolId: 'T002', dueDate: '2025-06-16 10:00', status: 'Pendiente' },
    ]
  }
};

const ReturnProcessPage = () => {
  const [studentIdScan, setStudentIdScan] = useState('');
  const [scannedStudent, setScannedStudent] = useState(null);
  const [scannedToolId, setScannedToolId] = useState('');
  const [returnedTools, setReturnedTools] = useState({}); // { loanId: true }
  const { toast } = useToast();

  const handleStudentScan = () => {
    if (!studentIdScan) {
      toast({ title: "Entrada Vacía", description: "Por favor, ingrese/escanee ID de estudiante.", variant: "destructive" });
      return;
    }
    const student = mockStudentData[studentIdScan.toUpperCase()];
    if (student) {
      setScannedStudent({ id: studentIdScan.toUpperCase(), ...student });
      setReturnedTools({});
      toast({ title: "Estudiante Encontrado", description: `Mostrando préstamos activos para ${student.name}.` });
    } else {
      setScannedStudent(null);
      toast({ title: "Estudiante No Encontrado", description: `No se encontró estudiante con ID ${studentIdScan}.`, variant: "destructive" });
    }
  };

  const handleToolScan = () => {
    if (!scannedStudent || !scannedToolId) {
      toast({ title: "Error", description: "Escanee primero al estudiante y luego la herramienta.", variant: "destructive" });
      return;
    }
    const loanToReturn = scannedStudent.activeLoans.find(loan => loan.toolId === scannedToolId.toUpperCase() && !returnedTools[loan.id]);
    if (loanToReturn) {
      setReturnedTools(prev => ({ ...prev, [loanToReturn.id]: true }));
      toast({ title: "Herramienta Registrada", description: `${loanToReturn.toolName} marcada como devuelta.` });
      setScannedToolId(''); // Clear for next scan
    } else {
      const alreadyReturned = scannedStudent.activeLoans.find(loan => loan.toolId === scannedToolId.toUpperCase() && returnedTools[loan.id]);
      if (alreadyReturned) {
        toast({ title: "Ya Registrada", description: `La herramienta ${scannedToolId.toUpperCase()} ya fue marcada como devuelta.`, variant: "default" });
      } else {
        toast({ title: "Herramienta No Coincide", description: `La herramienta ${scannedToolId.toUpperCase()} no está en los préstamos activos o ya fue devuelta.`, variant: "destructive" });
      }
    }
  };
  
  const completeReturnProcess = () => {
    if (!scannedStudent || Object.keys(returnedTools).length === 0) {
      toast({ title: "Proceso Incompleto", description: "No hay herramientas marcadas para devolución.", variant: "destructive" });
      return;
    }
    
    const allLoans = scannedStudent.activeLoans;
    const returnedLoanIds = Object.keys(returnedTools);
    const notReturnedLoans = allLoans.filter(loan => !returnedLoanIds.includes(loan.id));

    let message = `Devolución completada para ${scannedStudent.name}. `;
    message += `${returnedLoanIds.length} herramienta(s) devuelta(s). `;

    if (notReturnedLoans.length > 0) {
      message += `${notReturnedLoans.length} herramienta(s) pendiente(s): ${notReturnedLoans.map(l => l.toolName).join(', ')}.`;
      toast({ title: "Devolución Parcial", description: message, variant: "default", duration: 7000 });
    } else {
      message += "Todas las herramientas activas fueron devueltas.";
      toast({ title: "Devolución Completa", description: message, variant: "default", duration: 5000 });
    }
    
    // Reset state
    setStudentIdScan('');
    setScannedStudent(null);
    setScannedToolId('');
    setReturnedTools({});
  };

  const isLoanOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gradient-gold-teal">Proceso de Devolución de Material</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-card shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-primary"><Fingerprint className="mr-2 h-6 w-6" /> Escanear Estudiante</CardTitle>
              <CardDescription>Ingrese o escanee el ID del estudiante para ver sus préstamos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="studentIdScan" className="text-secondary">ID del Estudiante (Ej: S001)</Label>
                <div className="flex gap-2">
                  <Input 
                    id="studentIdScan" 
                    value={studentIdScan} 
                    onChange={(e) => setStudentIdScan(e.target.value)} 
                    placeholder="SXXX"
                    className="bg-input border-custom-gold/30 focus:border-custom-gold"
                  />
                  <Button onClick={handleStudentScan} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Fingerprint className="mr-2 h-4 w-4" /> Buscar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className={`bg-card shadow-lg ${!scannedStudent ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center text-primary"><ScanLine className="mr-2 h-6 w-6" /> Escanear Herramienta</CardTitle>
              <CardDescription>Una vez encontrado el estudiante, escanee cada herramienta devuelta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="toolIdScan" className="text-secondary">ID de la Herramienta (Ej: T001)</Label>
                <div className="flex gap-2">
                  <Input 
                    id="toolIdScan" 
                    value={scannedToolId} 
                    onChange={(e) => setScannedToolId(e.target.value)} 
                    placeholder="TXXX"
                    disabled={!scannedStudent}
                    className="bg-input border-custom-gold/30 focus:border-custom-gold"
                  />
                  <Button onClick={handleToolScan} disabled={!scannedStudent} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <ScanLine className="mr-2 h-4 w-4" /> Registrar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {scannedStudent && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-card shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-gradient-gold-teal">Préstamos Activos de: {scannedStudent.name}</CardTitle>
              <CardDescription>Marque las herramientas que están siendo devueltas.</CardDescription>
            </CardHeader>
            <CardContent>
              {scannedStudent.activeLoans.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-custom-gold">Herramienta</TableHead>
                      <TableHead className="text-custom-gold hidden md:table-cell">ID Herramienta</TableHead>
                      <TableHead className="text-custom-gold">Fecha Límite</TableHead>
                      <TableHead className="text-custom-gold text-center">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scannedStudent.activeLoans.map(loan => (
                      <TableRow key={loan.id} className={`${returnedTools[loan.id] ? 'bg-green-500/10' : ''} ${isLoanOverdue(loan.dueDate) && !returnedTools[loan.id] ? 'bg-red-500/10' : ''}`}>
                        <TableCell className="font-medium text-foreground">{loan.toolName}</TableCell>
                        <TableCell className="text-muted-foreground hidden md:table-cell">{loan.toolId}</TableCell>
                        <TableCell className={`text-muted-foreground ${isLoanOverdue(loan.dueDate) && !returnedTools[loan.id] ? 'text-red-500 font-semibold' : ''}`}>
                          <Clock className={`inline h-4 w-4 mr-1 ${isLoanOverdue(loan.dueDate) && !returnedTools[loan.id] ? 'text-red-500' : 'text-muted-foreground'}`} />
                          {new Date(loan.dueDate).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          {returnedTools[loan.id] ? (
                            <span className="flex items-center justify-center text-green-500"><CheckCircle className="mr-1 h-5 w-5" /> Devuelta</span>
                          ) : isLoanOverdue(loan.dueDate) ? (
                             <span className="flex items-center justify-center text-red-500"><AlertCircle className="mr-1 h-5 w-5" /> Vencido</span>
                          ) : (
                            <span className="text-yellow-500">Pendiente</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-4">Este estudiante no tiene préstamos activos.</p>
              )}
              {scannedStudent.activeLoans.length > 0 && (
                 <div className="mt-6 flex justify-end">
                    <Button onClick={completeReturnProcess} size="lg" className="bg-custom-teal hover:bg-custom-teal/90 text-white">
                        Completar Devolución
                    </Button>
                 </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ReturnProcessPage;
