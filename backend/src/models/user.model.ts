import mongoose, { type HydratedDocument, type Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserAttrs {
  name: string;
  email: string;
  password: string;
  avatar?: string | null;
}

export interface UserMethods {
  comparePassword(candidate: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<UserAttrs, UserMethods>;
type UserModel = Model<UserAttrs, {}, UserMethods>;

const userSchema = new mongoose.Schema<UserAttrs, UserModel, UserMethods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete (ret as Partial<UserAttrs> & { __v?: number }).password;
    delete (ret as { __v?: number }).__v;
    return ret;
  },
});

export const User = mongoose.model<UserAttrs, UserModel>('User', userSchema);
