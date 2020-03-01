import multer from 'multer';
import { Router } from 'express';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';

import middlewareAuth from './app/middlewares/auth';
import middlewareIsAdmin from './app/middlewares/isAdmin';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// ONLY AUTHENTICATED ROUTES BELOW --------------------------------------------
routes.use(middlewareAuth);
// once the middlewareAuth finishes successfully, req has the userId field

routes.get('/users', UserController.index);

const upload = multer(multerConfig);
routes.post('/files', upload.single('file'), FileController.store);

// ONLY ADMIN ROUTES BELOW ----------------------------------------------------
routes.use(middlewareIsAdmin);

routes.post('/users', UserController.store);
routes.put('/users', UserController.update);

routes.post('/recipients', RecipientController.store);
routes.get('/recipients', RecipientController.index);
routes.put('/recipients/:id', RecipientController.update);

routes.post('/deliverymen', DeliverymanController.store);
routes.get('/deliverymen', DeliverymanController.index);
routes.get('/deliverymen/:id', DeliverymanController.show);
routes.put('/deliverymen/:id', DeliverymanController.update);
routes.delete('/deliverymen/:id', DeliverymanController.delete);
export default routes;
