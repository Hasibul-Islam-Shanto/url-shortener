import { customAlphabet } from 'nanoid';
import { env } from '../config/env.js';
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, env.shortCodeLength);
export function generateShortCode() {
    return nanoid();
}
