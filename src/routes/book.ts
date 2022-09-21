import express from 'express';
import controller from '../controllers/book';
import adminRoleCheck from '../middleware/adminRoleCheck';
import extractJWT from '../middleware/extractJWT';
import moderRoleCheck from '../middleware/moderRoleCheck';

const router = express.Router();

router.get('/get-all', extractJWT, controller.getAll);
router.post('/upload', extractJWT, controller.upload);
router.get('/genres', extractJWT, controller.getGenres);
router.post('/remove', extractJWT, controller.remove);
router.post('/apply', extractJWT, moderRoleCheck, controller.apply);
router.post('/rate', extractJWT, controller.rate);
router.post('/add-to-favorites', extractJWT, controller.addToFavorites);
router.post('/remove-from-favorites', extractJWT, controller.removeFromFavorites);

export = router;
