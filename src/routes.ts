import { Router } from 'express';

// Middlewares
import Validator from './app/middlewares/Validator';

// Validators
import CreateMachineValidator from './app/validators/machine/Create';
import DeleteMachineValidator from './app/validators/machine/Delete';
import CreateReportValidator from './app/validators/report/Create';
import IndexReportValidator from './app/validators/report/Index';

// Controllers
import MachineController from './app/controllers/MachineController';
import ReportController from './app/controllers/ReportController';

const routes = Router();

// Routes
// // Machines
routes.get('/machines', MachineController.index);
routes.post(
  '/machines',
  Validator(CreateMachineValidator),
  MachineController.create,
);

routes.delete(
  '/machines/:machineId',
  Validator(DeleteMachineValidator),
  MachineController.delete,
);

// // Reports
routes.get(
  '/reports/:machineId',
  Validator(IndexReportValidator),
  ReportController.index,
);
routes.post(
  '/reports/:machineId',
  Validator(CreateReportValidator),
  ReportController.create,
);

export default routes;
