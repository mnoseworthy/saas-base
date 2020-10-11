import { Server } from 'https';
import opn from 'opn';

import startServer from './server';
import {createConnection} from "typeorm";
import { User } from './Models/User'
import * as config from "./config";
try {
  
  const PORT : number = Number(process.env.SERVER_PORT) || Number(config.SERVER_PORT);
  const SERVER_ROOT_DOMAIN =  process.env.SERVER_ROOT_DOMAIN || config.SERVER_ROOT_DOMAIN;
  const POSTGRES_USERNAME =  process.env.POSTGRES_USERNAME || config.POSTGRES_USERNAME;
  const POSTGRES_PASSWORD =  process.env.POSTGRES_PASSWORD|| config.POSTGRES_PASSWORD;
  const POSTGRES_DATABASE =  process.env.POSTGRES_DATABASE || config.POSTGRES_DATABASE;
  const POSTGRES_HOST =  process.env.POSTGRES_HOST || config.POSTGRES_HOST;
  const POSTGRES_PORT =  Number(process.env.POSTGRES_PORT) || Number(config.POSTGRES_PORT);

  let server: Server;

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(data => {
      if (server) {
        server.close();
      }
      data.hotReloaded = true;
    });
    module.hot.addStatusHandler(status => {
      if (status === 'fail') {
        process.exit(250);
      }
    });
  }

  const firstStartInDevMode =
    module.hot && process.env.LAST_EXIT_CODE === '0' && (!module.hot.data || !module.hot.data.hotReloaded);

  startServer(PORT).then(serverInstance => {
    if (!module.hot || firstStartInDevMode) {
      console.log(`GraphQL Server is now running on${SERVER_ROOT_DOMAIN}:${PORT}`);
      if (firstStartInDevMode) {
        opn(`${SERVER_ROOT_DOMAIN}:${PORT}/graphiql`);
        let config = {
          type: "postgres",
          host: POSTGRES_HOST,
          port: POSTGRES_PORT,
          username: POSTGRES_USERNAME,
          password: POSTGRES_PASSWORD,
          database: POSTGRES_DATABASE,
          entities: [User],
          synchronize: true,
        }
        console.log(config);
        createConnection({
          type: "postgres",
          host: POSTGRES_HOST,
          port: POSTGRES_PORT,
          username: POSTGRES_USERNAME,
          password: POSTGRES_PASSWORD,
          database: POSTGRES_DATABASE,
          entities: [User],
          synchronize: true,
        })
      }
    }

    server = serverInstance;
  });
} catch (e) {
  console.error(e);
  process.exit(1);
}
