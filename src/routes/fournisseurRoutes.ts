import { Router } from 'express';
import { fetchAndSaveApis } from '../controllers/fournisseurController';

const router = Router();

router.get('/fetchApis', fetchAndSaveApis);

export default router;
