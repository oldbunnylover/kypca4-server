import express from 'express';
import controller from '../controllers/user';
import adminRoleCheck from '../middleware/adminRoleCheck';
import extractJWT from '../middleware/extractJWT';
import moderRoleCheck from '../middleware/moderRoleCheck';
import webLogin from '../middleware/webLogin';

const router = express.Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/web-login', webLogin, controller.login);
router.get('/get', extractJWT, controller.getUser);
router.get('/update-token', extractJWT, controller.updateToken);
router.post('/change-email', extractJWT, controller.changeUserEmail);
router.post('/change-password', extractJWT, controller.changeUserPassword);
router.post('/change-role', extractJWT, adminRoleCheck, controller.changeUserRole);
router.post('/block', extractJWT, adminRoleCheck, controller.blockUser);

export = router;
