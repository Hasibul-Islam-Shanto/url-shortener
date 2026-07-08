import { Router } from 'express';
import authRoutes from './auth.routes.js';
import urlRoutes from './url.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/urls', urlRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
