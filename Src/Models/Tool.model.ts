// import { Schema, model, Document, Types } from 'mongoose';

// export interface ITool extends Document {
//   nombre: string;
//   codigo_barras: string;
//   descripcion: string;
//   cantidad_total: number;
//   cantidad_disponible: number;
//   status: 'active' | 'maintenance' | 'blocked';
//   imagen?: string;
//   alerta_mantenimiento: boolean;
//   uso_acumulado: number;
//   tiempo_promedio_uso: number;
//   ultima_revision: Date;
//   supervisor_asignado?: Types.ObjectId;
// }

// const toolSchema = new Schema<ITool>({
//   nombre: { type: String, required: true },
//   codigo_barras: { type: String, required: true, unique: true },
//   descripcion: { type: String },
//   cantidad_total: { type: Number, required: true },
//   cantidad_disponible: { type: Number, required: true },
//   status: { type: String, enum: ['active', 'maintenance', 'blocked'], default: 'active' },
//   imagen: { type: String },
//   alerta_mantenimiento: { type: Boolean, default: false },
//   uso_acumulado: { type: Number, default: 0 },
//   tiempo_promedio_uso: { type: Number, default: 0 },
//   ultima_revision: { type: Date },
//   supervisor_asignado: { type: Schema.Types.ObjectId, ref: 'Supervisor' },
// });

// export default model<ITool>('Tool', toolSchema);
import { Schema, model, Document, Types } from 'mongoose';

export interface ITool extends Document {
  name: string;
  barcode: string;
  description: string;
  total_quantity: number;
  available_quantity: number;
  status: 'active' | 'maintenance' | 'blocked';
  image?: string;
  maintenance_alert: boolean;
  accumulated_use: number;
  average_use_time: number;
  last_revision: Date;
  assigned_supervisor?: Types.ObjectId;
}

const toolSchema = new Schema<ITool>({
  name: { type: String, required: true },
  barcode: { type: String, required: true, unique: true },
  description: { type: String },
  total_quantity: { type: Number, required: true },
  available_quantity: { type: Number, required: true },
  status: { type: String, enum: ['active', 'maintenance', 'blocked'], default: 'active' },
  image: { type: String },
  maintenance_alert: { type: Boolean, default: false },
  accumulated_use: { type: Number, default: 0 },
  average_use_time: { type: Number, default: 0 },
  last_revision: { type: Date },
  assigned_supervisor: { type: Schema.Types.ObjectId, ref: 'Supervisor' },
});

export default model<ITool>('Tool', toolSchema);
