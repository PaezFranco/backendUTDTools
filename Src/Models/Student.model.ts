
// import { Schema, model, Document } from 'mongoose';

// export interface IStudent extends Document {
//   matricula: string;
//   email: string;
//   password?: string;
//   full_name?: string;
//   carrera?: string;
//   cuatrimestre?: number;
//   grupo?: string;
//   telefono?: string;
//   registro_completo: boolean;
//   huella_registrada: boolean;
//   bloqueado: boolean;
//   motivo_bloqueo?: string;
//   fecha_registro: Date;
// }

// const studentSchema = new Schema<IStudent>({
//   matricula: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String },
//   full_name: { type: String },
//   carrera: { type: String },
//   cuatrimestre: { type: Number },
//   grupo: { type: String },
//   telefono: { type: String },
//   registro_completo: { type: Boolean, default: false },
//   huella_registrada: { type: Boolean, default: false },
//   bloqueado: { type: Boolean, default: false },
//   motivo_bloqueo: { type: String },
//   fecha_registro: { type: Date, default: Date.now },
// });

// export default model<IStudent>('Student', studentSchema);
import { Schema, model, Document } from 'mongoose';

export interface IStudent extends Document {
  student_id: string;
  email: string;
  password?: string;
  full_name?: string;
  career?: string;
  semester?: number;
  group?: string;
  phone?: string;
  is_profile_complete: boolean;
  fingerprint_registered: boolean;
  is_blocked: boolean;
  block_reason?: string;
  registration_date: Date;
}

const studentSchema = new Schema<IStudent>({
  student_id: { type: String, required: true, unique: true }, // corresponds to matrícula
  email: { type: String, required: true, unique: true },
  password: { type: String },
  full_name: { type: String },
  career: { type: String },
  semester: { type: Number },
  group: { type: String },
  phone: { type: String },
  is_profile_complete: { type: Boolean, default: false },
  fingerprint_registered: { type: Boolean, default: false },
  is_blocked: { type: Boolean, default: false },
  block_reason: { type: String },
  registration_date: { type: Date, default: Date.now },
});

export default model<IStudent>('Student', studentSchema);
