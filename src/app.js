import { config } from 'dotenv';
import express from 'express';
import routes from './routes';

import './database';

config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
