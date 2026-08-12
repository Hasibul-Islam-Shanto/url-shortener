import net from 'node:net';
import { env } from '../config/env.js';

const RESERVED_SHORT_CODES = new Set([
  'api',
  'assets',
  'dashboard',
  'favicon',
  'healthz',
  'login',
  'logout',
  'profile',
  'readyz',
  'register',
  'settings',
  'urls',
]);

const LOCAL_HOSTS = new Set(['localhost', 'localhost.localdomain', 'ip6-localhost', 'ip6-loopback']);

export function isReservedShortCode(value: string) {
  return RESERVED_SHORT_CODES.has(value.trim().toLowerCase());
}

export function isAllowedRedirectUrl(value: string) {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    return false;
  }

  if (!['http:', 'https:'].includes(url.protocol)) return false;

  const hostname = normalizeHostname(url.hostname);
  if (!hostname) return false;

  if (env.allowedRedirectHosts.length > 0) {
    return env.allowedRedirectHosts.some((allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`));
  }

  if (LOCAL_HOSTS.has(hostname)) return false;
  if (isOwnServiceHost(hostname)) return false;
  if (env.blockedRedirectHosts.some((blocked) => hostname === blocked || hostname.endsWith(`.${blocked}`))) {
    return false;
  }

  return !isPrivateIpAddress(hostname);
}

function normalizeHostname(hostname: string) {
  return hostname.replace(/^\[|\]$/g, '').replace(/\.$/, '').toLowerCase();
}

function isOwnServiceHost(hostname: string) {
  return [env.baseUrl, env.clientUrl].some((base) => {
    try {
      return normalizeHostname(new URL(base).hostname) === hostname;
    } catch {
      return false;
    }
  });
}

function isPrivateIpAddress(hostname: string) {
  const version = net.isIP(hostname);
  if (version === 4) return isPrivateIpv4(hostname);
  if (version === 6) return isPrivateIpv6(hostname);
  return false;
}

function isPrivateIpv4(hostname: string) {
  const [a, b] = hostname.split('.').map(Number);

  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
}

function isPrivateIpv6(hostname: string) {
  const normalized = hostname.toLowerCase();

  return (
    normalized === '::' ||
    normalized === '::1' ||
    normalized.startsWith('fc') ||
    normalized.startsWith('fd') ||
    normalized.startsWith('fe80:')
  );
}
