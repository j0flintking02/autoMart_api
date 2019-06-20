/* eslint-disable camelcase */
import { Router } from 'express';
import auth from '../middleware/auth';
import admin from '../middleware/admin';
import manager from '../controllers/carController';


const router = Router();


router.get('/car', manager.viewCarManager);
router.post('/car', auth, manager.addCar);

// TODO: User can view a specific car
router.get('/car/:id', auth, manager.singleCar);

// TODO: seller can update the price
router.put('/car/:id/price', auth, manager.updatePrice);


// TODO: seller can mark his/her posted AD as sold
router.put('/car/:id/status', auth, manager.updateStatus);

// TODO: buyer can make a purchase order
router.post('/order', auth, manager.makeOrder);

// todo: buyer can be able to update purchase order
router.put('/order/:id/price', auth, manager.updateOrder);
// TODO: Admin can delete a posted AS record
router.delete('/car/:id/', [auth, admin], manager.deleteAD);
// TODO: Admin can view posted ads if sold or unsold
router.get('/all', [auth, admin], manager.getAll);
export default router;
