import { Router } from 'express';
import { login, createFournisseur, loginFournisseur } from '../controllers/userController';

const router = Router();

router.post('/login', login);
router.post('/createfournisseur', createFournisseur);
router.post('/login-fournisseur', loginFournisseur); 

export default router;
