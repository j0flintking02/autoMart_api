import {
  Router,
} from 'express';

import userManager from '../controllers/userController';

const router = Router();

router.post('/signup', userManager.createUser);

router.post('/signin', userManager.loginUser);

export default router;
