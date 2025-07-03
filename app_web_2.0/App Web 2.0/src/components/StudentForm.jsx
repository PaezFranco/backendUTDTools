
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Fingerprint } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const StudentForm = ({ studentData, onSubmit, onCancel, predefinedCareers, isEditing, isCompletingRegistration }) => {
  const [formData, setFormData] = useState(studentData);
  const { toast } = useToast();

  useEffect(() => {
    setFormData(studentData);
  }, [studentData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "studentId") {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: numericValue }));
      } else {
        toast({
          title: "Límite Alcanzado",
          description: "La matrícula no puede exceder los 10 dígitos.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: name === 'cuatrimestre' || name === 'loans' ? parseInt(value) || '' : value }));
    }
  };

  const handleCareerChange = (value) => {
    setFormData(prev => ({ ...prev, career: value }));
  };

  const handleStatusChange = (value) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleRegisterFingerprint = () => {
    const newFingerprintId = `FP-SIM-${Date.now().toString().slice(-5)}`;
    setFormData(prev => ({ ...prev, fingerprintId: newFingerprintId }));
    toast({
      title: "Registro de Huella (Simulado)",
      description: `Coloque el dedo... ¡Huella registrada! ID Asignado: ${newFingerprintId}`,
      duration: 5000,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.studentId.length !== 10) {
      toast({
        title: "Matrícula Inválida",
        description: "La matrícula debe contener exactamente 10 dígitos.",
        variant: "destructive",
      });
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} id="student-form-modal-component" className="grid grid-cols-1 gap-y-4 gap-x-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="space-y-1">
        <Label htmlFor="studentId-form" className="text-custom-gold">Matrícula (10 dígitos)</Label>
        <Input
          id="studentId-form"
          name="studentId"
          value={formData?.studentId || ''}
          onChange={handleInputChange}
          className="bg-input border-custom-gold/30 focus:border-custom-gold"
          required
          placeholder="Ej: 3141230012"
          readOnly={isCompletingRegistration || (isEditing && !isCompletingRegistration)}
          pattern="\d{10}"
          title="La matrícula debe contener 10 números."
          maxLength={10}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="name-form" className="text-custom-gold">Nombre Completo</Label>
        <Input
          id="name-form"
          name="name"
          value={formData?.name || ''}
          onChange={handleInputChange}
          className="bg-input border-custom-gold/30 focus:border-custom-gold"
          required
          readOnly={isCompletingRegistration}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email-form" className="text-custom-gold">Email Institucional</Label>
        <Input id="email-form" name="email" type="email" value={formData?.email || ''} onChange={handleInputChange} className="bg-input border-custom-gold/30 focus:border-custom-gold" required />
      </div>

      <div className="space-y-1">
        <Label htmlFor="career-form" className="text-custom-gold">Carrera</Label>
        <Select
          value={formData?.career || ''}
          onValueChange={handleCareerChange}
        >
          <SelectTrigger className="w-full bg-input border-custom-gold/30 focus:border-custom-gold text-foreground h-10">
            <SelectValue placeholder="Seleccione una carrera" />
          </SelectTrigger>
          <SelectContent className="bg-card border-custom-gold/50 text-foreground">
            {predefinedCareers.map(career => (
              <SelectItem key={career} value={career}>{career}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="cuatrimestre-form" className="text-custom-gold">Cuatrimestre</Label>
        <Input id="cuatrimestre-form" name="cuatrimestre" type="number" min="1" max="12" value={formData?.cuatrimestre || 1} onChange={handleInputChange} className="bg-input border-custom-gold/30 focus:border-custom-gold" required />
      </div>

      <div className="space-y-1">
        <Label htmlFor="phone-form" className="text-custom-gold">Teléfono</Label>
        <Input id="phone-form" name="phone" type="tel" value={formData?.phone || ''} onChange={handleInputChange} className="bg-input border-custom-gold/30 focus:border-custom-gold" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="status-form" className="text-custom-gold">Estado</Label>
        <Select
          value={formData?.status || 'Activo'}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-full bg-input border-custom-gold/30 focus:border-custom-gold text-foreground h-10">
            <SelectValue placeholder="Seleccione estado" />
          </SelectTrigger>
          <SelectContent className="bg-card border-custom-gold/50 text-foreground">
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="Bloqueado">Bloqueado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData?.status === 'Bloqueado' && (
        <div className="space-y-1">
          <Label htmlFor="blockReason-form" className="text-custom-gold">Motivo Bloqueo</Label>
          <Input id="blockReason-form" name="blockReason" value={formData?.blockReason || ''} onChange={handleInputChange} className="bg-input border-custom-gold/30 focus:border-custom-gold" />
        </div>
      )}

      <div className="space-y-1">
        <Label htmlFor="fingerprintId-form" className="text-custom-gold">ID Huella Digital</Label>
        <div className="flex items-center gap-2">
          <Input
            id="fingerprintId-form"
            name="fingerprintId"
            value={formData?.fingerprintId || ''}
            onChange={handleInputChange}
            className="flex-grow bg-input border-custom-gold/30 focus:border-custom-gold"
            placeholder="ID de Huella (ej: FP-SIM-XXX)"
            readOnly={!!formData?.fingerprintId && !isCompletingRegistration && !isEditing}
          />
          <Button type="button" variant="outline" onClick={handleRegisterFingerprint} className="border-secondary text-secondary hover:bg-secondary/10 shrink-0">
            <Fingerprint className="mr-2 h-4 w-4" />
            Registrar Huella
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">El ID de la huella se genera/asigna al registrarla.</p>
      </div>
      <input type="hidden" name="id" value={formData?.id || ''} />
      <input type="hidden" name="registrationDate" value={formData?.registrationDate || ''} />
      <input type="hidden" name="loans" value={formData?.loans || 0} />


      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="border-custom-orange text-custom-orange hover:bg-custom-orange/10">Cancelar</Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">Guardar Cambios</Button>
      </div>
    </form>
  );
};

export default StudentForm;
