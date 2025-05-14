import express from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware.js';
import { login } from '../controllers/auth.controller.js';
const router = express.Router();


router.post('/login', login);
router.post();
router.post();
router.post();
router.post();
router.post();

export default router;
