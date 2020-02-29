import multer from 'multer';
import { Router } from 'express';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
// once the authMiddleware finishes successfully, req has the userId field
// from this line to the end of file, all routes require authentication
routes.get('/users', UserController.index);
routes.put('/users', UserController.update);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

const upload = multer(multerConfig);
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
