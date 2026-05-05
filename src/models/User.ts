import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  uid: string;
  email: string;
  role: string;
  nombre: string;
  fechaRegistro: Date;
  estado: string;
}

const UserSchema: Schema = new Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'user-boda'], default: 'user-boda' },
  nombre: { type: String, required: true },
  fechaRegistro: { type: Date, default: Date.now },
  estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' }
});

export default mongoose.model<IUser>('User', UserSchema);
