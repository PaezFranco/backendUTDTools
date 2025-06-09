// import { Schema, model, Document, Types } from 'mongoose';

// export interface IIaSuggestion extends Document {
//   herramientas_id: Types.ObjectId[];
//   riesgo: 'medio' | 'alto';
//   razones: {
//     uso_acumulado: number;
//     retrasos: number;
//     devoluciones_incompletas: number;
//   };
//   fecha_sugerida: Date;
//   atendida: boolean;
//   atendida_por: Types.ObjectId[];
// }

// const iaSuggestionSchema = new Schema<IIaSuggestion>({
//   herramientas_id: [{ type: Schema.Types.ObjectId, ref: 'Tool' }],
//   riesgo: { type: String, enum: ['medio', 'alto'] },
//   razones: {
//     uso_acumulado: { type: Number },
//     retrasos: { type: Number },
//     devoluciones_incompletas: { type: Number },
//   },
//   fecha_sugerida: { type: Date, default: Date.now },
//   atendida: { type: Boolean, default: false },
//   atendida_por: [{ type: Schema.Types.ObjectId, ref: 'Supervisor' }],
// });

// export default model<IIaSuggestion>('IaSuggestion', iaSuggestionSchema);
import { Schema, model, Document, Types } from 'mongoose';

export interface IIaSuggestion extends Document {
  tool_ids: Types.ObjectId[];
  risk_level: 'medium' | 'high';
  reasons: {
    total_usage: number;
    delays: number;
    incomplete_returns: number;
  };
  suggested_date: Date;
  attended: boolean;
  attended_by: Types.ObjectId[];
}

const iaSuggestionSchema = new Schema<IIaSuggestion>({
  tool_ids: [{ type: Schema.Types.ObjectId, ref: 'Tool' }],
  risk_level: { type: String, enum: ['medium', 'high'] },
  reasons: {
    total_usage: { type: Number },
    delays: { type: Number },
    incomplete_returns: { type: Number },
  },
  suggested_date: { type: Date, default: Date.now },
  attended: { type: Boolean, default: false },
  attended_by: [{ type: Schema.Types.ObjectId, ref: 'Supervisor' }],
});

export default model<IIaSuggestion>('IaSuggestion', iaSuggestionSchema);
