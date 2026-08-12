import mongoose from 'mongoose';

export interface AnalyticsAttrs {
  url: mongoose.Types.ObjectId;
  browser: string;
  operatingSystem: string;
  device: string;
  ipAddress?: string;
  referrer: string;
  visitedAt: Date;
}

const analyticsSchema = new mongoose.Schema<AnalyticsAttrs>(
  {
    url: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Url',
      required: true,
      index: true,
    },
    browser: {
      type: String,
      default: 'Unknown',
    },
    operatingSystem: {
      type: String,
      default: 'Unknown',
    },
    device: {
      type: String,
      default: 'desktop',
    },
    ipAddress: {
      type: String,
    },
    referrer: {
      type: String,
      default: 'Direct',
    },
    visitedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

analyticsSchema.index({ url: 1, visitedAt: -1 });

export const Analytics = mongoose.model<AnalyticsAttrs>('Analytics', analyticsSchema);
