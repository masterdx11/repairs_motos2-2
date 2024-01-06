import express from 'express';
import {
  deleteOne,
  findAll,
  create,
  findOne,
  login,
  updateOne,
} from './users.controller.js';
import {
  protect,
  protectAccountOwner,
  validateExistUser,
} from './users.middleware.js';

export const router = express.Router();
router.post('/', create);
router.post('/login', login);
router.use(protect);
router.get('/', findAll);
router
  .route('/:id')
  .get(validateExistUser, findOne)
  .patch(validateExistUser, protectAccountOwner, updateOne)
  .delete(validateExistUser, protectAccountOwner, deleteOne);
