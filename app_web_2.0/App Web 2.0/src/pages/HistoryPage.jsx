
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, CalendarDays, ArrowRightLeft, User, Wrench, Clock, UserCog, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const initialHistoryData = [
  { id: 'H001', studentId: 'S001', studentName: 'Ana García López', toolId: 'T001-A', toolName: 'Taladro Percutor Bosch', type: 'Préstamo', loanDateTime: '2025-05-01T09:15:00', dueDateTime: '2025-05-01T15:15:00', actualReturnDateTime: '2025-05-01T15:00:00', admin: 'Daniel Morales', details: 'Préstamo estándar.' },
  { id: 'H003', studentId: 'S002', studentName: 'Luis Martínez Rodríguez', toolId: 'T002-B', toolName: 'Sierra Circular Skil', type: 'Préstamo', loanDateTime: '2025-05-02T10:30:00', dueDateTime: '2025-05-02T16:30:00', actualReturnDateTime: '2025-05-02T17:00:00', admin: 'Daniel Morales', details: 'Devuelto con ligero retraso.' },
  { id: 'H004', toolId: 'T003-M', toolName: 'Multímetro Digital UNI-T', type: 'Mantenimiento', loanDateTime: '2025-05-03T11:00:00', dueDateTime: null, actualReturnDateTime: null, admin: 'Daniel Morales', details: 'Calibración realizada.' },
  { id: 'H005', studentId: 'S004', studentName: 'Carlos Sánchez Gómez', toolId: 'T004-F', toolName: 'Kit de Destornilladores', type: 'Préstamo', loanDateTime: '2025-05-04T14:00:00', dueDateTime: '2025-05-04T20:00:00', actualReturnDateTime: '2025-05-04T19:50:00', admin: 'Laura Vargas', details: 'Préstamo estándar.' },
  { id: 'H006', studentId: 'S001', studentName: 'Ana García López', toolId: 'T005-C', toolName: 'Llave Inglesa Stanley', type: 'Préstamo', loanDateTime: '2025-05-05T08:30:00', dueDateTime: '2025-05-05T14:30:00', actualReturnDateTime: null, admin: 'Daniel Morales', details: 'Préstamo activo.' },
];


const HistoryPage = () => {
  const [history, setHistory] = useState(
    initialHistoryData.map(item => ({
      ...item,
      dueDateTime: item.dueDateTime ? new Date(item.dueDateTime).toISOString() : null,
      loanDateTime: new Date(item.loanDateTime).toISOString(),
      actualReturnDateTime: item.actualReturnDateTime ? new Date(item.actualReturnDateTime).toISOString() : null,
    })).sort((a, b) => new Date(b.loanDateTime) - new Date(a.loanDateTime))
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos'); 
  const [filterEntity, setFilterEntity] = useState(''); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [newDueDate, setNewDueDate] = useState('');
  const [newDueTime, setNewDueTime] = useState('');
  const { toast } = useToast();

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleFilterTypeChange = (value) => {
    setFilterType(value);
  };
  
  const handleFilterEntityChange = (event) => {
    setFilterEntity(event.target.value.toLowerCase());
  };

  const openEditModal = (entry) => {
    if (entry.type !== 'Préstamo' || entry.actualReturnDateTime) {
        toast({ title: "No Editable", description: "Solo los préstamos activos pueden tener su fecha límite modificada.", variant: "destructive"});
        return;
    }
    setEditingEntry(entry);
    const dueDate = entry.dueDateTime ? new Date(entry.dueDateTime) : new Date();
    setNewDueDate(dueDate.toISOString().split('T')[0]);
    setNewDueTime(dueDate.toTimeString().split(' ')[0].substring(0,5));
    setIsEditModalOpen(true);
  };

  const handleSaveDueDate = () => {
    if (editingEntry && newDueDate && newDueTime) {
      const updatedDueDateTime = new Date(`${newDueDate}T${newDueTime}:00`).toISOString();
      setHistory(prevHistory => 
        prevHistory.map(item => 
          item.id === editingEntry.id 
            ? { ...item, dueDateTime: updatedDueDateTime, details: `${item.details.split(' Modificado:')[0]} Modificado: Nueva fecha límite ${new Date(updatedDueDateTime).toLocaleString()}` } 
            : item
        )
      );
      toast({ title: "Fecha Límite Actualizada", description: `La fecha límite para ${editingEntry.toolName} ha sido cambiada.` });
      setIsEditModalOpen(false);
      setEditingEntry(null);
    } else {
      toast({ title: "Error", description: "Por favor, seleccione fecha y hora válidas.", variant: "destructive"});
    }
  };


  const filteredHistory = history.filter(item => {
    const matchesSearchTerm = searchTerm === '' ||
      item.studentName?.toLowerCase().includes(searchTerm) ||
      item.toolName.toLowerCase().includes(searchTerm) ||
      item.details.toLowerCase().includes(searchTerm) ||
      item.admin?.toLowerCase().includes(searchTerm) ||
      item.id.toLowerCase().includes(searchTerm);

    const matchesFilterType = filterType === 'todos' || item.type.toLowerCase() === filterType;
    
    const matchesFilterEntity = filterEntity === '' ||
      item.studentId?.toLowerCase().includes(filterEntity) ||
      item.studentName?.toLowerCase().includes(filterEntity) ||
      item.toolId?.toLowerCase().includes(filterEntity) ||
      item.toolName?.toLowerCase().includes(filterEntity);

    return matchesSearchTerm && matchesFilterType && matchesFilterEntity;
  });
  
  const getTypeAttributes = (item) => {
    if (item.type === 'Préstamo' && !item.actualReturnDateTime && item.dueDateTime && new Date(item.dueDateTime) < new Date()) {
      return { icon: <ArrowRightLeft className="h-4 w-4 text-red-500" />, color: 'text-red-500', label: 'Préstamo Vencido' };
    }
    if (item.type === 'Préstamo' && !item.actualReturnDateTime) {
      return { icon: <ArrowRightLeft className="h-4 w-4 text-blue-500" />, color: 'text-blue-500', label: 'Préstamo Activo' };
    }
    if (item.type === 'Préstamo' && item.actualReturnDateTime) {
      return { icon: <ArrowRightLeft className="h-4 w-4 text-custom-orange" />, color: 'text-custom-orange', label: 'Préstamo' };
    }
    if (item.type === 'Devolución' || (item.type === 'Préstamo' && item.actualReturnDateTime)) {
      return { icon: <ArrowRightLeft className="h-4 w-4 text-primary transform rotate-180" />, color: 'text-primary', label: 'Devolución' };
    }
    if (item.type === 'Mantenimiento') {
      return { icon: <Wrench className="h-4 w-4 text-purple-500" />, color: 'text-purple-500', label: 'Mantenimiento' };
    }
    return { icon: <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />, color: 'text-muted-foreground', label: item.type };
  };


  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gradient-gold-teal">Historial Completo</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar en historial..."
              className="pl-10 w-full bg-input border-custom-gold/30 focus:border-custom-gold"
              onChange={handleSearch}
              value={searchTerm}
            />
          </div>
          <Select value={filterType} onValueChange={handleFilterTypeChange}>
            <SelectTrigger className="w-full sm:w-[180px] bg-input border-custom-gold/30 focus:border-custom-gold text-foreground">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent className="bg-card border-custom-gold/50 text-foreground">
              <SelectItem value="todos">Todos los Tipos</SelectItem>
              <SelectItem value="préstamo">Préstamos</SelectItem>
              <SelectItem value="devolución">Devoluciones</SelectItem>
              <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="relative mb-4">
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Wrench className="absolute left-9 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Filtrar por Estudiante o Herramienta (ID/Nombre)..."
          className="pl-16 w-full bg-input border-custom-gold/30 focus:border-custom-gold"
          onChange={handleFilterEntityChange}
          value={filterEntity}
        />
      </div>


      <motion.div 
        className="rounded-lg border border-border shadow-sm bg-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="overflow-x-auto">
            <Table className="w-full">
            <TableHeader>
                <TableRow className="hover:bg-muted/50">
                <TableHead className="text-custom-gold px-3 py-3 whitespace-nowrap min-w-[150px]">Tipo</TableHead>
                <TableHead className="text-custom-gold px-3 py-3 whitespace-nowrap min-w-[200px]">Entidad</TableHead>
                <TableHead className="text-custom-gold px-3 py-3 hidden md:table-cell whitespace-nowrap min-w-[130px]">Hora Préstamo</TableHead>
                <TableHead className="text-custom-gold px-3 py-3 whitespace-nowrap min-w-[170px]">Fecha Límite</TableHead>
                <TableHead className="text-custom-gold px-3 py-3 hidden lg:table-cell whitespace-nowrap min-w-[170px]">Devolución Real</TableHead>
                <TableHead className="text-custom-gold px-3 py-3 hidden xl:table-cell whitespace-nowrap min-w-[150px]">Admin</TableHead>
                <TableHead className="text-custom-gold px-3 py-3 text-right whitespace-nowrap min-w-[80px]">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredHistory.map((item) => {
                const { icon, color, label } = getTypeAttributes(item);
                return (
                    <TableRow key={item.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className={`${color} font-semibold flex items-center px-3 py-3 whitespace-nowrap`}>
                        {icon}
                        <span className="ml-2">{label}</span>
                    </TableCell>
                    <TableCell className="text-foreground px-3 py-3 whitespace-nowrap max-w-[200px]">
                        {item.studentName && (
                        <Link to={`/students/${item.studentId}`} className="hover:underline flex items-center text-sm truncate" title={item.studentName}>
                            <User className="inline h-3 w-3 mr-1 text-primary flex-shrink-0"/>{item.studentName}
                        </Link>
                        )}
                        <div className="text-xs text-muted-foreground flex items-center truncate" title={`${item.toolName} (${item.toolId})`}>
                            <Wrench className="inline h-3 w-3 mr-1 text-primary flex-shrink-0"/>{item.toolName} ({item.toolId})
                        </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell px-3 py-3 whitespace-nowrap">
                        <Clock className="inline h-4 w-4 mr-1"/>
                        {new Date(item.loanDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                    <TableCell className="text-muted-foreground px-3 py-3 whitespace-nowrap">
                        {item.dueDateTime ? (
                            <>
                            <CalendarDays className="inline h-4 w-4 mr-1"/>
                            {new Date(item.dueDateTime).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </>
                        ) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden lg:table-cell px-3 py-3 whitespace-nowrap">
                        {item.actualReturnDateTime ? (
                            <>
                            <CalendarDays className="inline h-4 w-4 mr-1"/>
                            {new Date(item.actualReturnDateTime).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </>
                        ) : 'Pendiente'}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden xl:table-cell px-3 py-3 whitespace-nowrap">
                        <UserCog className="inline h-4 w-4 mr-1"/>
                        {item.admin}
                    </TableCell>
                    <TableCell className="text-right px-3 py-3 whitespace-nowrap">
                        {item.type === 'Préstamo' && !item.actualReturnDateTime && (
                            <Button variant="ghost" size="icon" onClick={() => openEditModal(item)} title="Editar Fecha Límite" className="h-7 w-7">
                                <Edit2 className="h-4 w-4 text-blue-500"/>
                            </Button>
                        )}
                    </TableCell>
                    </TableRow>
                );
                })}
            </TableBody>
            </Table>
        </div>
      </motion.div>
      {filteredHistory.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No se encontraron registros en el historial que coincidan con los filtros.</p>
      )}

    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md bg-card border-custom-gold/50">
            <DialogHeader>
                <DialogTitle className="text-gradient-gold-teal">Editar Fecha Límite</DialogTitle>
                <DialogDescription>
                    Ajusta la fecha y hora límite para el préstamo de: <span className="font-semibold">{editingEntry?.toolName}</span> para <span className="font-semibold">{editingEntry?.studentName}</span>.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="newDueDate" className="text-right text-custom-gold col-span-1">Nueva Fecha</Label>
                    <Input 
                        id="newDueDate" 
                        type="date" 
                        value={newDueDate} 
                        onChange={(e) => setNewDueDate(e.target.value)}
                        className="col-span-3 bg-input border-custom-gold/30 focus:border-custom-gold"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="newDueTime" className="text-right text-custom-gold col-span-1">Nueva Hora</Label>
                    <Input 
                        id="newDueTime" 
                        type="time" 
                        value={newDueTime}
                        onChange={(e) => setNewDueTime(e.target.value)}
                        className="col-span-3 bg-input border-custom-gold/30 focus:border-custom-gold"
                    />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="border-custom-orange text-custom-orange hover:bg-custom-orange/10">Cancelar</Button>
                <Button onClick={handleSaveDueDate} className="bg-primary hover:bg-primary/90 text-primary-foreground">Guardar Cambios</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    </motion.div>
  );
};

export default HistoryPage;
