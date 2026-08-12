import crypto from 'node:crypto';
import { User } from '../models/user.model.js';
import { AuthSession } from '../models/session.model.js';
import { ApiError } from '../utils/ApiError.js';
import { signToken } from '../utils/jwt.js';
import { env } from '../config/env.js';
import { parseDurationToMs } from '../utils/duration.js';

interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

interface LoginUserInput {
  email: string;
  password: string;
}

interface UpdateProfileInput {
  name?: string;
  avatar?: string | null;
}

export async function registerUser({ name, email, password }: RegisterUserInput) {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'Email is already registered');
  }

  const user = await User.create({ name, email, password });
  const token = await createSessionToken(user._id.toString());

  return { user, token };
}

export async function loginUser({ email, password }: LoginUserInput) {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = await createSessionToken(user._id.toString());

  return { user, token };
}

export async function revokeSession(tokenId: string) {
  await AuthSession.updateOne({ tokenId, revokedAt: null }, { $set: { revokedAt: new Date() } });
}

export async function getProfile(userId: string) {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
}

export async function updateProfile(userId: string, { name, avatar }: UpdateProfileInput) {
  const update: UpdateProfileInput = {};
  if (name !== undefined) update.name = name;
  if (avatar !== undefined) update.avatar = avatar;

  const user = await User.findByIdAndUpdate(userId, update, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
}

async function createSessionToken(userId: string) {
  const tokenId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + parseDurationToMs(env.jwtExpiresIn));

  await AuthSession.create({
    tokenId,
    user: userId,
    expiresAt,
  });

  return signToken({ id: userId, sessionId: tokenId });
}
