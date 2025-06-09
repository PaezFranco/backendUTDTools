import { Schema, model, Document } from 'mongoose';

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  registration_date: Date;
  active: boolean;
}

const adminSchema = new Schema<IAdmin>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  registration_date: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
});

export default model<IAdmin>('Admin', adminSchema);
