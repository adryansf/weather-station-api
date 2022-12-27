import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';

import { connect as dbConnect } from './database';
import routes from './routes';

class App {
  server: Express;

  constructor() {
    dbConnect();
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(helmet());
    this.server.use(express.json());
  }

  routes() {
    this.server.use('/', routes);
  }
}

export default new App().server;
