
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, BarChart2, ListChecks, AlertTriangle, Users, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const ReportsPage = () => {
  const { toast } = useToast();

  const handleGenerateReport = (reportType) => {
    toast({
      title: "Generando Reporte...",
      description: `Se está simulando la generación del reporte de ${reportType}. En una aplicación real, aquí se descargaría el archivo.`,
      duration: 5000,
    });
    // Simulación de descarga
    console.log(`Simulando descarga del reporte: ${reportType}`);
  };

  const reportOptions = [
    { title: "Uso de Herramientas", description: "Estadísticas detalladas sobre la frecuencia de uso de cada herramienta.", icon: <BarChart2 className="h-8 w-8 text-primary" />, type: "Uso de Herramientas" },
    { title: "Historial de Préstamos", description: "Registro completo de todos los préstamos y devoluciones por fecha.", icon: <ListChecks className="h-8 w-8 text-custom-orange" />, type: "Historial de Préstamos" },
    { title: "Materiales Vencidos", description: "Lista de herramientas no devueltas a tiempo y estudiantes responsables.", icon: <AlertTriangle className="h-8 w-8 text-destructive" />, type: "Materiales Vencidos" },
    { title: "Actividad de Estudiantes", description: "Reporte sobre los préstamos y devoluciones por estudiante.", icon: <Users className="h-8 w-8 text-secondary" />, type: "Actividad de Estudiantes" },
    { title: "Mantenimiento de Herramientas", description: "Estado de mantenimiento, fechas y herramientas que requieren atención.", icon: <Wrench className="h-8 w-8 text-blue-500" />, type: "Mantenimiento de Herramientas" },
  ];

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gradient-gold-teal">Generación de Reportes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportOptions.map((report, index) => (
          <motion.div
            key={report.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
            className="transform transition-all duration-200"
          >
            <Card className="bg-card shadow-lg h-full flex flex-col">
              <CardHeader className="flex-row items-center gap-4">
                {report.icon}
                <div>
                  <CardTitle className="text-xl text-foreground">{report.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-muted-foreground mb-4">{report.description}</CardDescription>
              </CardContent>
              <div className="p-6 pt-0">
                <Button 
                  onClick={() => handleGenerateReport(report.type)} 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Generar Reporte (Simulado)
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      <Card className="bg-card shadow-lg mt-8">
        <CardHeader>
            <CardTitle className="text-xl text-gradient-gold-teal">Personalizar Reporte (Simulación)</CardTitle>
            <CardDescription>En una versión completa, aquí podrías seleccionar rangos de fechas, filtros específicos, etc.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-grow">
                <Label htmlFor="dateRange" className="text-secondary">Rango de Fechas (Simulado)</Label>
                <Input type="text" id="dateRange" placeholder="Ej: 01/05/2025 - 31/05/2025" className="bg-input border-custom-gold/30 focus:border-custom-gold" />
            </div>
            <Button onClick={() => toast({title: "Funcionalidad no implementada", description: "🚧 Esta característica de personalización de reportes no está implementada aún. 🚀"})} className="bg-custom-orange hover:bg-custom-orange/90 text-white">
                Aplicar Filtros (Simulado)
            </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReportsPage;
