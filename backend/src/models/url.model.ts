import mongoose, { type HydratedDocument, type Types } from 'mongoose';

export interface UrlAttrs {
  originalUrl: string;
  shortCode: string;
  user: Types.ObjectId;
  clickCount: number;
  isActive: boolean;
  expiresAt?: Date | null;
  lastClickedAt?: Date | null;
}

export type UrlDocument = HydratedDocument<UrlAttrs>;

const urlSchema = new mongoose.Schema<UrlAttrs>(
  {
    originalUrl: {
      type: String,
      required: true,
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    lastClickedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

urlSchema.index({ user: 1, createdAt: -1 });

urlSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete (ret as { __v?: number }).__v;
    return ret;
  },
});

export const Url = mongoose.model<UrlAttrs>('Url', urlSchema);
