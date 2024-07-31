import { Router } from 'express';
import {  createFournisseur, loginFournisseur } from '../controllers/userController';

const router = Router();


router.post('/createfournisseur', createFournisseur);
router.post('/login-fournisseur', loginFournisseur); 

export default router;
