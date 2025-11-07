import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'psicologo' | 'paciente';
  psychologistId?: mongoose.Types.ObjectId | string | null;
  phone?: string;
  age?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'psicologo', 'paciente'], default: 'paciente' },
    psychologistId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    phone: { type: String },
    age: { type: Number }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;