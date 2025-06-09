// import { Schema, model, Document } from 'mongoose';

// export interface ISupervisor extends Document {
//   nombre: string;
//   email: string;
//   password: string;
//   estado: boolean;
//   fecha_asignacion: Date;
//   ubicacion_asignada?: string;
// }

// const supervisorSchema = new Schema<ISupervisor>({
//   nombre: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   estado: { type: Boolean, default: false },
//   fecha_asignacion: { type: Date, default: Date.now },
//   ubicacion_asignada: { type: String },
// });

// export default model<ISupervisor>('Supervisor', supervisorSchema);
import { Schema, model, Document } from 'mongoose';

export interface ISupervisor extends Document {
  name: string;
  email: string;
  password: string;
  is_active: boolean;
  assignment_date: Date;
  assigned_location?: string;
}

const supervisorSchema = new Schema<ISupervisor>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  is_active: { type: Boolean, default: false },
  assignment_date: { type: Date, default: Date.now },
  assigned_location: { type: String },
});

export default model<ISupervisor>('Supervisor', supervisorSchema);
