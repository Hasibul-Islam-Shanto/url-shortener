import { Router } from 'express';
import { validate } from '../middleware/validate.middleware.js';
import { protect } from '../middleware/auth.middleware.js';
import {
  createUrlSchema,
  updateUrlSchema,
  listUrlsQuerySchema,
} from '../validators/url.validator.js';
import { objectIdSchema, paginationSchema } from '../validators/common.validator.js';
import * as urlController from '../controllers/url.controller.js';
import { getAnalyticsForUrl } from '../controllers/analytics.controller.js';

const router = Router();

router.use(protect);

router.post('/', validate(createUrlSchema), urlController.createUrl);
router.get('/', validate(listUrlsQuerySchema, 'query'), urlController.listUrls);
router.get('/:id', validate(objectIdSchema, 'params'), urlController.getUrl);
router.patch(
  '/:id',
  validate(objectIdSchema, 'params'),
  validate(updateUrlSchema),
  urlController.updateUrl
);
router.delete('/:id', validate(objectIdSchema, 'params'), urlController.deleteUrl);
router.get(
  '/:id/analytics',
  validate(objectIdSchema, 'params'),
  validate(paginationSchema, 'query'),
  getAnalyticsForUrl
);

export default router;
