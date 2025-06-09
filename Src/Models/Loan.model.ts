// import { Schema, model, Document, Types } from 'mongoose';

// export interface ILoan extends Document {
//   estudiante_id: Types.ObjectId;
//   supervisor_id: Types.ObjectId;
//   herramientas_prestadas: { herramienta_id: Types.ObjectId; cantidad: number }[];
//   fecha_prestamo: Date;
//   fecha_devolucion_estimada: Date;
//   fecha_devolucion_real?: Date;
//   estado: 'activo' | 'devuelto' | 'retrasado';
//   tiempo_configurado: number; // en minutos
// }

// const loanSchema = new Schema<ILoan>({
//   estudiante_id: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
//   supervisor_id: { type: Schema.Types.ObjectId, ref: 'Supervisor', required: true },
//   herramientas_prestadas: [
//     {
//       herramienta_id: { type: Schema.Types.ObjectId, ref: 'Tool' },
//       cantidad: { type: Number },
//     },
//   ],
//   fecha_prestamo: { type: Date, default: Date.now },
//   fecha_devolucion_estimada: { type: Date, required: true },
//   fecha_devolucion_real: { type: Date },
//   estado: { type: String, enum: ['activo', 'devuelto', 'retrasado'], default: 'activo' },
//   tiempo_configurado: { type: Number, default: 360 }, // 6 horas por default
// });

// export default model<ILoan>('Loan', loanSchema);
import { Schema, model, Document, Types } from 'mongoose';

export interface ILoan extends Document {
  student_id: Types.ObjectId;
  supervisor_id: Types.ObjectId;
  borrowed_tools: { tool_id: Types.ObjectId; quantity: number }[];
  loan_date: Date;
  estimated_return_date: Date;
  actual_return_date?: Date;
  status: 'active' | 'returned' | 'delayed';
  configured_time: number; // in minutes
}

const loanSchema = new Schema<ILoan>({
  student_id: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  supervisor_id: { type: Schema.Types.ObjectId, ref: 'Supervisor', required: true },
  borrowed_tools: [
    {
      tool_id: { type: Schema.Types.ObjectId, ref: 'Tool' },
      quantity: { type: Number },
    },
  ],
  loan_date: { type: Date, default: Date.now },
  estimated_return_date: { type: Date, required: true },
  actual_return_date: { type: Date },
  status: { type: String, enum: ['active', 'returned', 'delayed'], default: 'active' },
  configured_time: { type: Number, default: 360 }, // 6 hours by default
});

export default model<ILoan>('Loan', loanSchema);
