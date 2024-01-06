import { catchAsync } from '../../common/errors/catchAsync.js';
import { validatePartialRepair, validateRepair } from './repairs.schema.js';
import { RepairsService } from './repairs.service.js';

export const findAll = catchAsync(async (req, res, next) => {
  const repairs = await RepairsService.findAll();
  return res.status(201).json(repairs);
});

export const create = catchAsync(async (req, res) => {
  const { hasError, errorMessages, repairData } = validateRepair(req.body);

  if (hasError) {
    return res.status(422).json({
      status: 'error',
      message: errorMessages,
    });
  }

  const repairs = await RepairsService.create(repairData);

  return res.status(201).json({
    date: repairs.date,
    motorsNumber: repairs.motorsNumber,
    description: repairs.description,
  });
});
export const findOne = catchAsync(async (req, res) => {
  const { repair } = req;

  return res.status(200).json(repair);
});
export const updateOne = catchAsync(async (req, res) => {
  const { repair } = req;

  const { hasError, errorMessages, repairData } = validatePartialRepair(
    req.body
  );

  if (hasError) {
    return res.status(422).json({
      status: 'error',
      message: errorMessages,
    });
  }

  const repairUpdate = await RepairsService.update(repair, repairData);
  return res.status(200).json(repairUpdate);
});
export const deleteOne = catchAsync(async (req, res) => {
  const { repair } = req;

  await RepairsService.delete(repair);

  return res.status(204).json(null);
});
