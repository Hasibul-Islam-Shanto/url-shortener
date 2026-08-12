import { Router } from 'express';
import { validate } from '../middleware/validate.middleware.js';
import { shortCodeParamSchema } from '../validators/url.validator.js';
import { handleRedirect } from '../controllers/redirect.controller.js';

const router = Router();

router.get('/:shortCode', validate(shortCodeParamSchema, 'params'), handleRedirect);

export default router;
