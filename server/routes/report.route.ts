import { Router } from 'express';
import reportController from '../controllers/report.controller';

const reportRouter = Router();

reportRouter.post('/sector-data', reportController.generateSectorData);

export default reportRouter;