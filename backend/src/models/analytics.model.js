import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
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

export const Analytics = mongoose.model('Analytics', analyticsSchema);
