import { AppError } from '../../common/errors/appError.js';
import { catchAsync } from '../../common/errors/catchAsync.js';
import { verifyPassword } from '../../config/plugins/encripted-password.plugin.js';
import { generateJWT } from '../../config/plugins/generate-jwt.plugin.js';
import {
  validateLogin,
  validatePartialUser,
  validateUser,
} from './users.schema.js';
import { UsersService } from './users.service.js';
export const login = catchAsync(async (req, res, next) => {
  const { hasError, errorMessages, userData } = validateLogin(req.body);

  if (hasError) {
    return res.status(422).json({
      status: 'error',
      message: errorMessages,
    });
  }

  const user = await UsersService.findOneByEmail(userData.email);

  if (!user) {
    return next(new AppError('This account does not exist', 404));
  }

  const isCorrectPassword = await verifyPassword(
    userData.password,
    user.password
  );

  if (!isCorrectPassword) {
    return next(new AppError('Icorrect email or password', 401));
  }

  const token = await generateJWT(user.id);

  return res.status(200).json({
    token: token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});
export const findAll = catchAsync(async (req, res, next) => {
  const users = await UsersService.findAll();

  return res.status(201).json(users);
});
export const create = catchAsync(async (req, res) => {
  const { hasError, errorMessages, userData } = validateUser(req.body);

  if (hasError) {
    return res.status(422).json({
      status: 'error',
      message: errorMessages,
    });
  }

  const user = await UsersService.create(userData);

  return res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role,
  });
});
export const findOne = catchAsync(async (req, res, next) => {
  const { user } = req;

  return res.status(200).json(user);
});
export const updateOne = catchAsync(async (req, res, next) => {
  const { user } = req;

  const { hasError, errorMessages, userData } = validatePartialUser(req.body);

  if (hasError) {
    return res.status(422).json({
      status: 'error',
      message: errorMessages,
    });
  }

  const userUpdate = await UsersService.update(user, userData);
  return res.status(200).json(userUpdate);
});
export const deleteOne = catchAsync(async (req, res) => {
  const { user } = req;

  await UsersService.delete(user);

  return res.status(204).json(null);
});
