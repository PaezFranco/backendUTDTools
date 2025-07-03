
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserCircle, Mail, Save, Clock, MapPin, CalendarCheck, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const AdminProfilePage = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      const userWithDefaults = {
        ...storedUser,
        assignmentDate: storedUser.assignmentDate || '2025-01-15',
        assignedLocation: storedUser.assignedLocation || (storedUser.name === "Daniel Morales" ? "Caseta Pesado 1" : "Caseta Ligero 2"),
        shift: storedUser.name === "Daniel Morales" ? "Mañana (8am - 1pm)" : (storedUser.shift || "Tarde (1pm - 8pm)")
      };
      setAdminUser(userWithDefaults);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword) {
      if (formData.newPassword === formData.confirmPassword) {
        toast({ title: "Contraseña Actualizada", description: "Tu contraseña ha sido cambiada (simulación)." });
        // Here you would typically make an API call to change the password
        // For simulation, we just show a toast and reset fields
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setIsEditingPassword(false); // Close password editing section
      } else {
        toast({ title: "Error de Contraseña", description: "Las nuevas contraseñas no coinciden.", variant: "destructive" });
      }
    } else {
      toast({ title: "Sin cambios", description: "No se ingresó una nueva contraseña.", variant: "default" });
      setIsEditingPassword(false);
    }
  };

  if (!adminUser) {
    return <div className="text-center p-8">Cargando perfil del administrador...</div>;
  }

  return (
    <motion.div 
      className="space-y-6 max-w-2xl mx-auto"
      initial={{ opacity: 0, y:20 }}
      animate={{ opacity: 1, y:0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gradient-gold-teal text-center">Mi Perfil de Administrador</h1>
      
      <Card className="bg-card shadow-xl">
        <CardHeader className="items-center text-center">
          <UserCircle className="w-24 h-24 text-primary mb-4" />
          <CardTitle className="text-2xl text-foreground">{adminUser.name}</CardTitle>
          <CardDescription className="text-secondary">{adminUser.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminName" className="text-custom-gold">Nombre Completo</Label>
              <Input 
                id="adminName" 
                value={adminUser.name} 
                readOnly 
                className="bg-muted/50 border-custom-gold/30 text-muted-foreground cursor-not-allowed" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail" className="text-custom-gold">Correo Electrónico</Label>
              <Input 
                id="adminEmail" 
                type="email" 
                value={adminUser.email} 
                readOnly 
                className="bg-muted/50 border-custom-gold/30 text-muted-foreground cursor-not-allowed" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminShift" className="text-custom-gold">Turno Asignado</Label>
              <div className="flex items-center p-3 rounded-md bg-muted/50 border border-custom-gold/30">
                <Clock className="w-5 h-5 mr-2 text-primary" />
                <span className="text-foreground">{adminUser.shift}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminAssignmentDate" className="text-custom-gold">Fecha de Asignación</Label>
              <div className="flex items-center p-3 rounded-md bg-muted/50 border border-custom-gold/30">
                <CalendarCheck className="w-5 h-5 mr-2 text-primary" />
                <span className="text-foreground">{new Date(adminUser.assignmentDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminAssignedLocation" className="text-custom-gold">Lugar Asignado</Label>
               <Input 
                id="adminAssignedLocation" 
                value={adminUser.assignedLocation} 
                readOnly 
                className="bg-muted/50 border-custom-gold/30 text-muted-foreground cursor-not-allowed" 
              />
            </div>

            <hr className="my-6 border-border" />
            
            {!isEditingPassword ? (
              <Button onClick={() => setIsEditingPassword(true)} variant="outline" className="w-full border-custom-orange text-custom-orange hover:bg-custom-orange/10">
                <KeyRound className="mr-2 h-4 w-4" /> Cambiar Contraseña (Simulado)
              </Button>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-2">
                <h3 className="text-lg font-semibold text-gradient-gold-teal">Cambiar Contraseña</h3>
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-custom-gold">Contraseña Actual</Label>
                  <Input id="currentPassword" name="currentPassword" type="password" placeholder="••••••••" value={formData.currentPassword} onChange={handleInputChange} className="bg-input border-custom-gold/50 focus:border-custom-gold" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-custom-gold">Nueva Contraseña</Label>
                  <Input id="newPassword" name="newPassword" type="password" placeholder="••••••••" value={formData.newPassword} onChange={handleInputChange} className="bg-input border-custom-gold/50 focus:border-custom-gold" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-custom-gold">Confirmar Nueva Contraseña</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleInputChange} className="bg-input border-custom-gold/50 focus:border-custom-gold" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="ghost" onClick={() => { setIsEditingPassword(false); setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });}}>
                        Cancelar
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Save className="mr-2 h-4 w-4" /> Guardar Contraseña
                    </Button>
                </div>
              </form>
            )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminProfilePage;
