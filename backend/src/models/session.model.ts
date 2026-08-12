import mongoose, { type HydratedDocument, type Types } from 'mongoose';

export interface AuthSessionAttrs {
  tokenId: string;
  user: Types.ObjectId;
  expiresAt: Date;
  revokedAt?: Date | null;
}

export type AuthSessionDocument = HydratedDocument<AuthSessionAttrs>;

const authSessionSchema = new mongoose.Schema<AuthSessionAttrs>(
  {
    tokenId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    revokedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

authSessionSchema.index({ user: 1, revokedAt: 1, expiresAt: 1 });

export const AuthSession = mongoose.model<AuthSessionAttrs>('AuthSession', authSessionSchema);
