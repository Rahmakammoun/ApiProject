
import { Router } from 'express';

import { executeAdminApi } from '../controllers/apiController';
import authenticateToken from '../middleware/authMiddleware';
import { authenticateToken as adminMiddleware } from '../middleware/adminMiddleware';

const router = Router();




router.post('/execute-admin-api', authenticateToken, adminMiddleware, executeAdminApi);

export default router;
