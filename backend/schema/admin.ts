import { generateToken } from '@be/utils/jwt';
import { comparePassword } from '@be/utils/password';
import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  name: string;
  dob?: Date | null;
  gender: 'male' | 'female' | 'other';
  email: string;
  password: string;
  role: 'superadmin' | 'admin';
  isBlocked: boolean;
  comparePassword(password: string): Promise<boolean>;
  generateToken(): string;
  generateRefreshToken(): string;
}

export const AdminSchema: Schema = new Schema({
  name: { type: String, default: '' },
  dob: { type: Date, default: null },
  gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'other',
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false, select: false },
  role: {
      type: String,
      enum: ['superadmin', 'admin'],
      default: 'admin',
  },
  isBlocked: { type: Boolean, default: false },
}, {
  timestamps: true,
  collection: 'admins',
});

AdminSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  if (!this.password) return false

  return await comparePassword(password, this.password)
};

AdminSchema.methods.generateToken = function (): string {
  const token = generateToken({
    id: this.id,
    email: this.email,
    name: this.name,
    role: this.role
  })

  return token
};

AdminSchema.methods.generateRefreshToken = function (): string {
  const token = generateToken(
    {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role
    },
    true
  )

  return token
};

export const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
