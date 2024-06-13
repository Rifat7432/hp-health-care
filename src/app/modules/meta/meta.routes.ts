import express from 'express';
import { MetaController } from './meta.controller';
import auth from '../../middlewares/auth';
import { userRole } from '@prisma/client';

const router = express.Router();

// Routes for fetching metadata for the dashboard
router.get(
    '/',
    auth(userRole.SUPER_ADMIN, userRole.ADMIN, userRole.DOCTOR, userRole.PATIENT),
    MetaController.fetchDashboardMetadata
);

export const MetaRoutes = router;
