import { AppError } from '../../common/errors/appError.js';
import { catchAsync } from '../../common/errors/catchAsync.js';
import envs from '../../config/enviroments/enviroments.js';
import { UsersService } from './users.service.js';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

export const validateExistUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await UsersService.findOne(id);
  if (!user) {
    return next(new AppError(`user with id: ${id} not found`, 404));
  }
  req.user = user;
  next();
});
export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not loggin in!. Please login to get access', 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, envs.SECRET_JWT_SEED);

  console.log(decoded);
  const user = await UsersService.findOne(decoded.id);

  if (!user) {
    return next(
      new AppError('The owner of this token is not longer available', 401)
    );
  }
  req.sessionUser = user;
  next();
});
export const restrictTo = (...rol) => {
  return (req, res, next) => {
    if (!rol.includes(req.sessionUser.role)) {
      return next(
        new AppError('You do not have permision to performe this action', 403)
      );
    }

    next();
  };
};
export const protectAccountOwner = catchAsync(async (req, res, next) => {
  const { user, sessionUser } = req;

  if (user.id !== sessionUser.id) {
    return next(new AppError('You do not own this account', 401));
  }

  next();
});
