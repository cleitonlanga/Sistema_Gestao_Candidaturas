import { Router } from 'express';
const router = Router();
import CandidaturaController from '../controllers/candidatura.controllers.js';

router.get('/candidaturas', CandidaturaController.index);
router.get('/candidaturas/stats', CandidaturaController.stats);
router.get('/candidaturas/:id', CandidaturaController.show);
router.post('/candidaturas', CandidaturaController.store);
router.put('/candidaturas/:id', CandidaturaController.update);
router.delete('/candidaturas/:id', CandidaturaController.destroy);

export default router;