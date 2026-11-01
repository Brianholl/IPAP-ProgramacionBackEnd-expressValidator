import express from 'express';
import informesControllers from '../controllers/informesControllers.js';

const router = express.Router();

router.get('/ventas', informesControllers.ventas);

export default router;
