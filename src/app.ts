import cors from 'cors';
import express, { Express, Request } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

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

    morgan.token('body', (req: Request) => {
      return JSON.stringify(req.body);
    });

    this.server.use(
      morgan(
        `:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" \nBody: :body\n`,
      ),
    );
  }

  routes() {
    this.server.use('/', routes);
  }
}

export default new App().server;
