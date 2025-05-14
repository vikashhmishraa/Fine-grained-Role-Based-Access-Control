import express from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware.js';
import { login,register, logout, refreshAccessToken, forgotPassword, resetPassword } from '../controllers/subAdmin.controller.js';
const router = express.Router();


router.post('/login', login);
router.post('/register', register);
router.post('/refresh-token', refreshAccessToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/logout', authenticate, logout); // 👈 Add authenticate middleware here



export default router;
