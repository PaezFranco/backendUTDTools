
import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash2, Search, Package, PackageCheck, PackageX, Wrench as ToolIcon, ChevronDown, ChevronUp, Tag, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ToolForm from '@/components/ToolForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTools } from '@/hooks/UseTools';

// Datos iniciales como fallback cuando no hay conexión
export const initialToolsData = [
  { uniqueId: 'T001-A', specificName: 'Taladro Percutor Bosch GSB 550 RE #1', category: 'Eléctrica', generalName: 'Taladro Percutor Bosch GSB 550 RE', status: 'Disponible', maintenance_status: 'OK', last_maintenance: '2025-03-15', next_maintenance: '2025-09-15', usage_count: 25 },
  { uniqueId: 'T001-B', specificName: 'Taladro Percutor Bosch GSB 550 RE #2', category: 'Eléctrica', generalName: 'Taladro Percutor Bosch GSB 550 RE', status: 'En Préstamo', maintenance_status: 'OK', last_maintenance: '2025-03-15', next_maintenance: '2025-09-15', usage_count: 30 },
  { uniqueId: 'T002-A', specificName: 'Sierra Circular Skil 5200 #1', category: 'Eléctrica', generalName: 'Sierra Circular Skil 5200', status: 'Disponible', maintenance_status: 'Sugerido', last_maintenance: '2025-04-01', next_maintenance: '2025-10-01', usage_count: 40 },
  { uniqueId: 'T003-M', specificName: 'Multímetro Digital UNI-T UT33C+', category: 'Medición', generalName: 'Multímetro Digital UNI-T UT33C+', status: 'Mantenimiento', maintenance_status: 'Urgente', last_maintenance: '2025-02-10', next_maintenance: '2025-05-10', usage_count: 60 },
  { uniqueId: 'T004-F', specificName: 'Kit Destornilladores Tramontina (10pz) #1', category: 'Manual', generalName: 'Kit de Destornilladores Tramontina (10 piezas)', status: 'Disponible', maintenance_status: 'OK', last_maintenance: '2025-01-20', next_maintenance: '2025-07-20', usage_count: 15 },
  { uniqueId: 'T005-C', specificName: 'Llave Inglesa Ajustable Stanley 8" #1', category: 'Manual', generalName: 'Llave Inglesa Ajustable Stanley 8"', status: 'Disponible', maintenance_status: 'OK', last_maintenance: '2025-05-01', next_maintenance: '2025-11-01', usage_count: 5 },
  { uniqueId: 'C001-X', specificName: 'Caja de Tornillos #A', category: 'Consumible', generalName: 'Tornillos para madera', status: 'Disponible', maintenance_status: 'N/A', usage_count: 0 },
  { uniqueId: 'M001-Z', specificName: 'Cautín Baku #3', category: 'Eléctrica', generalName: 'Cautín Baku', status: 'Mantenimiento', maintenance_status: 'Sugerido', last_maintenance: '2025-06-01', next_maintenance: '2025-12-01', usage_count: 12 },
];

const predefinedCategories = ['Eléctrica', 'Manual', 'Medición', 'Consumible', 'Seguridad', 'Otra'];

const ToolsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Hook personalizado para manejo de herramientas
  const {
    tools,
    loading,
    error,
    isConnected,
    loadTools,
    createTool,
    updateTool,
    deleteTool,
    checkConnection
  } = useTools();

  // Estados locales como fallback cuando no hay conexión
  const [localTools, setLocalTools] = useState(() => {
    const storedTools = localStorage.getItem('tools');
    try {
        const parsed = storedTools ? JSON.parse(storedTools) : initialToolsData;
        return Array.isArray(parsed) ? parsed : initialToolsData;
    } catch (error) {
        return initialToolsData;
    }
  });

  // Estados de la UI
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTool, setCurrentTool] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [toolToDelete, setToolToDelete] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(predefinedCategories.reduce((acc, category) => {
    acc[category] = true; 
    return acc;
  }, { 'Sin Categoría': true }));
  const [isScanningBarcode, setIsScanningBarcode] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Usar herramientas del backend si está conectado, sino usar las locales
  const currentTools = isConnected ? tools : localTools;

  // Guardar herramientas locales en localStorage cuando cambien
  useEffect(() => {
    if (!isConnected) {
      localStorage.setItem('tools', JSON.stringify(localTools));
    }
  }, [localTools, isConnected]);

  // Verificar filtros de la URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filter = searchParams.get('filter');
    if (filter === 'maintenance') {
      setActiveFilter('maintenance');
      setSearchTerm(''); 
    } else {
      setActiveFilter(null);
    }
  }, [location.search]);

  // Función para refrescar datos
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (isConnected) {
        await loadTools();
        toast({
          title: "Datos actualizados",
          description: "Las herramientas se han sincronizado con el servidor.",
        });
      } else {
        await checkConnection();
        if (isConnected) {
          await loadTools();
        } else {
          toast({
            title: "Sin conexión",
            description: "No se pudo conectar con el servidor. Trabajando en modo offline.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error al actualizar",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setActiveFilter(null); 
  };

  const filteredTools = useMemo(() => {
    let tempTools = currentTools;
    if (activeFilter === 'maintenance') {
      tempTools = tempTools.filter(tool => tool.status === 'Mantenimiento');
    }
    if (searchTerm) {
      tempTools = tempTools.filter(tool =>
        tool.specificName.toLowerCase().includes(searchTerm) ||
        tool.category.toLowerCase().includes(searchTerm) ||
        tool.uniqueId.toLowerCase().includes(searchTerm) ||
        tool.generalName.toLowerCase().includes(searchTerm)
      );
    }
    return tempTools;
  }, [currentTools, searchTerm, activeFilter]);

  const toolsByCategory = useMemo(() => {
    return filteredTools.reduce((acc, tool) => {
      const category = tool.category || 'Sin Categoría';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(tool);
      return acc;
    }, {});
  }, [filteredTools]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const openModal = (tool = null) => {
    const isEditingMode = !!tool?.uniqueId;
    setCurrentTool(tool ? { ...tool, isEditing: isEditingMode } : { 
      uniqueId: '', 
      specificName: '', 
      category: predefinedCategories[0], 
      generalName: '', 
      status: 'Disponible', 
      maintenance_status: 'OK', 
      last_maintenance: new Date().toISOString().split('T')[0], 
      next_maintenance: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0], 
      isEditing: false 
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTool(null);
    setIsScanningBarcode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTool(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (value) => {
    if (value === 'crear_nueva_categoria_placeholder') {
      toast({
        title: "Función no implementada",
        description: "🚧 La creación de nuevas categorías directamente desde aquí aún no está disponible. Puedes añadirla manualmente o solicitar esta función. 🚀",
      });
      return;
    }
    setCurrentTool(prev => ({ ...prev, category: value, maintenance_status: value === 'Consumible' ? 'N/A' : (prev.maintenance_status === 'N/A' ? 'OK' : prev.maintenance_status) }));
  };

  const handleSimulateScan = () => {
    setIsScanningBarcode(true);
    toast({ title: "Escaneando...", description: "Simulando escaneo de código de barras." });
    setTimeout(() => {
      const randomId = `SCN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setCurrentTool(prev => ({ ...prev, uniqueId: randomId }));
      setIsScanningBarcode(false);
      toast({ title: "¡Escaneo Completo!", description: `ID de herramienta simulado: ${randomId}` });
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas - CAMBIADO: uniqueId ya no es obligatorio aquí, se puede ingresar manualmente
    if (!currentTool.specificName || !currentTool.category || !currentTool.generalName) {
      toast({ 
        title: "Error", 
        description: "Nombre específico, categoría y nombre general son obligatorios.", 
        variant: "destructive" 
      });
      return;
    }

    // Validar uniqueId solo si está presente (puede estar vacío para entrada manual)
    if (!currentTool.uniqueId || currentTool.uniqueId.trim() === '') {
      toast({ 
        title: "Error", 
        description: "El ID Único / Código de Barras es obligatorio. Puedes ingresarlo manualmente o escanearlo.", 
        variant: "destructive" 
      });
      return;
    }
    
    try {
      if (currentTool.isEditing) { 
        if (isConnected) {
          await updateTool(currentTool._id, currentTool);
          toast({ title: "Herramienta Actualizada", description: `${currentTool.specificName} ha sido actualizada en el servidor.`});
        } else {
          // Modo offline
          setLocalTools(prev => prev.map(t => t.uniqueId === currentTool.uniqueId ? {...currentTool, isEditing: undefined } : t));
          toast({ title: "Herramienta Actualizada (Offline)", description: `${currentTool.specificName} ha sido actualizada localmente.`});
        }
      } else { 
        // Verificar ID duplicado
        if (currentTools.some(t => t.uniqueId === currentTool.uniqueId.trim())) {
          toast({ 
            title: "Error: ID Duplicado", 
            description: `El ID de herramienta ${currentTool.uniqueId} ya existe. Ingrese un ID único.`, 
            variant: "destructive" 
          });
          return;
        }
        
        if (isConnected) {
          await createTool(currentTool);
          toast({ title: "Herramienta Agregada", description: `${currentTool.specificName} ha sido agregada al servidor con ID ${currentTool.uniqueId}.`});
        } else {
          // Modo offline
          setLocalTools(prev => [...prev, { ...currentTool, usage_count: 0, isEditing: undefined }]);
          toast({ title: "Herramienta Agregada (Offline)", description: `${currentTool.specificName} ha sido agregada localmente con ID ${currentTool.uniqueId}.`});
        }
      }
      closeModal();
    } catch (error) {
      toast({ 
        title: "Error", 
        description: error.message || "No se pudo guardar la herramienta", 
        variant: "destructive" 
      });
    }
  };
  
  const openDeleteConfirm = (tool) => {
    setToolToDelete(tool);
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setToolToDelete(null);
    setIsDeleteConfirmOpen(false);
  };

  const handleDeleteTool = async () => {
    if (toolToDelete) {
      try {
        if (isConnected) {
          await deleteTool(toolToDelete._id);
          toast({ title: "Herramienta Eliminada", description: `${toolToDelete.specificName} ha sido eliminada del servidor.`});
        } else {
          // Modo offline
          setLocalTools(prev => prev.filter(t => t.uniqueId !== toolToDelete.uniqueId));
          toast({ title: "Herramienta Eliminada (Offline)", description: `${toolToDelete.specificName} ha sido eliminada localmente.`});
        }
        closeDeleteConfirm();
      } catch (error) {
        toast({ 
          title: "Error", 
          description: error.message || "No se pudo eliminar la herramienta", 
          variant: "destructive" 
        });
      }
    }
  };
  
  const getStatusIcon = (status) => {
    if (status === 'Disponible') return <PackageCheck className="h-5 w-5 text-green-500" />;
    if (status === 'En Préstamo') return <PackageX className="h-5 w-5 text-yellow-500" />;
    if (status === 'Mantenimiento') return <ToolIcon className="h-5 w-5 text-red-500" />;
    return <Package className="h-5 w-5 text-muted-foreground" />;
  };

  const getMaintenanceStatusColor = (status) => {
    if (status === 'Urgente') return 'text-red-400 bg-red-500/20';
    if (status === 'Sugerido') return 'text-yellow-400 bg-yellow-500/20';
    if (status === 'N/A') return 'text-gray-400 bg-gray-500/20';
    return 'text-green-400 bg-green-500/20';
  };

  // Mostrar indicador de carga mientras se cargan los datos
  if (loading && isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Cargando herramientas...</p>
        </div>
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
        <h1 className="text-3xl font-bold text-gradient-gold-teal">
          {activeFilter === 'maintenance' ? 'Herramientas en Mantenimiento' : 'Gestión de Herramientas'}
        </h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar herramientas..."
              className="pl-10 w-full sm:w-64 bg-input border-custom-gold/30 focus:border-custom-gold"
              onChange={handleSearch}
              value={searchTerm}
              disabled={!!activeFilter}
            />
          </div>
          <Button onClick={() => openModal()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-5 w-5" />
            Nueva
          </Button>
        </div>
      </div>

      {/* Estado de conexión */}
      <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">Conectado al servidor</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-orange-600">Modo offline</span>
            </>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="h-8"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {activeFilter === 'maintenance' && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive-foreground">
          <p className="text-sm font-medium">Mostrando solo herramientas en mantenimiento. <Button variant="link" className="p-0 h-auto text-destructive hover:underline" onClick={() => {setActiveFilter(null); navigate('/tools')}}>Ver todas las herramientas.</Button></p>
        </div>
      )}

      {Object.keys(toolsByCategory).sort().map(category => (
        <motion.div 
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-card shadow-lg">
            <CardHeader 
              className="flex flex-row items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleCategory(category)}
            >
              <h2 className="text-xl font-semibold text-primary flex items-center">
                <Tag className="mr-2 h-5 w-5" /> {category} ({toolsByCategory[category].length})
              </h2>
              {expandedCategories[category] ? <ChevronUp className="h-6 w-6 text-primary" /> : <ChevronDown className="h-6 w-6 text-primary" />}
            </CardHeader>
            <AnimatePresence>
            {expandedCategories[category] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow className="hover:bg-muted/50">
                          <TableHead className="text-custom-gold px-3 py-3 whitespace-nowrap min-w-[120px]">ID Único</TableHead>
                          <TableHead className="text-custom-gold px-3 py-3 whitespace-nowrap min-w-[200px]">Nombre Específico</TableHead>
                          <TableHead className="text-custom-gold px-3 py-3 hidden md:table-cell whitespace-nowrap min-w-[200px]">Nombre General</TableHead>
                          <TableHead className="text-custom-gold px-3 py-3 text-center whitespace-nowrap min-w-[100px]">Estado</TableHead>
                          <TableHead className="text-custom-gold px-3 py-3 text-center whitespace-nowrap min-w-[120px]">Mantenimiento</TableHead>
                          <TableHead className="text-custom-gold px-3 py-3 text-right whitespace-nowrap min-w-[90px]">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {toolsByCategory[category].map((tool) => (
                          <TableRow key={tool.uniqueId} className="hover:bg-muted/20 transition-colors">
                            <TableCell className="font-medium text-foreground px-3 py-3 whitespace-nowrap">{tool.uniqueId}</TableCell>
                            <TableCell className="text-foreground px-3 py-3 whitespace-nowrap max-w-[200px] truncate" title={tool.specificName}>{tool.specificName}</TableCell>
                            <TableCell className="text-muted-foreground hidden md:table-cell px-3 py-3 whitespace-nowrap max-w-[200px] truncate" title={tool.generalName}>{tool.generalName}</TableCell>
                            <TableCell className="text-center px-3 py-3 whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1">
                                {getStatusIcon(tool.status)}
                                <span className="hidden lg:inline text-xs">{tool.status}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center px-3 py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getMaintenanceStatusColor(tool.maintenance_status)}`}>
                                {tool.maintenance_status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right px-3 py-3 space-x-1 whitespace-nowrap">
                              <Button variant="ghost" size="icon" onClick={() => openModal(tool)} className="text-blue-500 hover:text-blue-400 h-7 w-7">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => openDeleteConfirm(tool)} className="text-destructive hover:text-destructive/80 h-7 w-7">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </motion.div>
            )}
            </AnimatePresence>
          </Card>
        </motion.div>
      ))}

      {Object.keys(toolsByCategory).length === 0 && (searchTerm || activeFilter) && (
        <p className="text-center text-muted-foreground py-8">
          {activeFilter === 'maintenance' ? 'No hay herramientas en mantenimiento.' : `No se encontraron herramientas que coincidan con "${searchTerm}".`}
        </p>
      )}
      {tools.length === 0 && !searchTerm && !activeFilter && (
        <p className="text-center text-muted-foreground py-8">No hay herramientas registradas.</p>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-custom-gold/50">
          <DialogHeader>
            <DialogTitle className="text-gradient-gold-teal">{currentTool?.isEditing ? 'Editar Herramienta' : 'Agregar Herramienta'}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {currentTool?.isEditing ? 'Modifica los detalles de la herramienta.' : 'Completa los detalles de la nueva herramienta. Puedes ingresar el ID manualmente o escanearlo.'}
            </DialogDescription>
          </DialogHeader>
          <ToolForm
            currentTool={currentTool}
            handleInputChange={handleInputChange}
            handleCategoryChange={handleCategoryChange}
            handleSimulateScan={handleSimulateScan}
            isScanningBarcode={isScanningBarcode}
            isEditing={currentTool?.isEditing}
            onSubmit={handleSubmit}
            predefinedCategories={predefinedCategories}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeModal} className="border-custom-orange text-custom-orange hover:bg-custom-orange/10">Cancelar</Button>
            <Button type="submit" form="tool-form" className="bg-primary hover:bg-primary/90 text-primary-foreground">Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md bg-card border-destructive/50">
            <DialogHeader>
                <DialogTitle className="text-destructive">Confirmar Eliminación</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                    ¿Estás seguro de que quieres eliminar <span className="font-semibold text-foreground">{toolToDelete?.specificName}</span> (ID: {toolToDelete?.uniqueId})? Esta acción no se puede deshacer.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeDeleteConfirm} className="border-muted-foreground text-muted-foreground hover:bg-muted/10">
                    Cancelar
                </Button>
                <Button type="button" variant="destructive" onClick={handleDeleteTool}>
                    Eliminar
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </motion.div>
  );
};

export default ToolsPage;

