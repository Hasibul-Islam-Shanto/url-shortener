import { asyncHandler } from '../utils/asyncHandler.js';
import { resolveAndRegisterClick } from '../services/redirect.service.js';

export const handleRedirect = asyncHandler(async (req, res) => {
  const { originalUrl } = await resolveAndRegisterClick(String(req.params.shortCode), {
    userAgent: req.headers['user-agent'],
    ip: req.ip,
    referrer: req.headers.referer,
  });

  res.redirect(302, originalUrl);
});
