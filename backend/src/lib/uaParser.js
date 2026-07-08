import { UAParser } from 'ua-parser-js';

export function parseUserAgent(uaString) {
  const result = new UAParser(uaString || '').getResult();

  return {
    browser: result.browser.name || 'Unknown',
    operatingSystem: result.os.name || 'Unknown',
    device: result.device.type || 'desktop',
  };
}
