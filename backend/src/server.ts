import { ApolloServer } from 'apollo-server-express';
import * as GraphiQL from 'apollo-server-module-graphiql';
import * as cors from 'cors';
import * as express from 'express';
import "reflect-metadata";
import { buildSchema } from 'type-graphql'; 
import { UserResolver } from './Models/User'
import { execute, subscribe } from 'graphql';
import { createServer, Server } from 'https';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import * as url from 'url';
import './passport';
import passport from 'passport';
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser"
import * as fs from 'fs';

type ExpressGraphQLOptionsFunction = (req?: express.Request, res?: express.Response) => any | Promise<any>;

function graphiqlExpress(options: GraphiQL.GraphiQLData | ExpressGraphQLOptionsFunction) {
  const graphiqlHandler = (req: express.Request, res: express.Response, next: any) => {
    const query = req.url && url.parse(req.url, true).query;
    GraphiQL.resolveGraphiQLString(query, options, req).then(
      (graphiqlString: any) => {
        res.setHeader('Content-Type', 'text/html');
        res.write(graphiqlString);
        res.end();
      },
      (error: any) => next(error)
    );
  };

  return graphiqlHandler;
}



export default async (port: number): Promise<Server> => {

  const app = express();

  // Configure CORS
  app.use('*', cors({
    origin: ["http://localhost:19006","http://192.168.2.34:19006"], // allow to server to accept request from different origin
    methods: "GET,HEAD,POST",
    credentials: true // allow session cookie from browser to pass through
  }));
  
  // Setup cookie session
  app.use(
    cookieSession({
      name: "session",
      keys: ["FFFFFFFFF"],
      maxAge: 24 * 60 * 60 * 100
    })
  );
  app.use(cookieParser());

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());
  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get('/auth/facebook/callback',
          passport.authenticate('facebook', { failureRedirect: '/loginFail' }),
          (req, res) => {
            console.log("Facebook auth callback");
            res.redirect('http://192.168.2.34:19006/')
        }
  );
  app.get('/auth/login/success', (req,res) => {
    console.log("/auth/login/success");
    if (req.user) {
      res.status(200).json({
        success: true,
        message: "user has successfully authenticated",
        user: req.user,
        cookies: req.cookies
      });
    }else{
      console.log("no auth in session");
      res.status(401);
      res.send("User is not authenticated");
    }
  })
  app.get('/auth/logout', (req,res) => {
    req.logout();
    res.status(200).json({
      success: true,
      message: "user has successfully unauthenticated",
    });
  })

  const server: Server = createServer({
      key: fs.readFileSync(`./ssl/development/key.pem`),
      cert: fs.readFileSync(`./ssl/development/cert.pem`),
    },
    app
  );

  const schema = await buildSchema({
    resolvers: [UserResolver]
  })
  const apolloServer = new ApolloServer({
    schema
  });

  apolloServer.applyMiddleware({ app, path: '/graphql' });

  if (module.hot) {
    app.use(
      '/graphiql',
      graphiqlExpress({
        endpointURL: '/graphql',
        query:
          '{GetUsers {id, email, uuid} }',
        subscriptionsEndpoint: `ws://localhost:${port}/subscriptions`,
        variables: { subject: 'World' }
      })
    );
  }

  return new Promise<Server>(resolve => {
    server.listen(port, () => {
      // tslint:disable-next-line
      new SubscriptionServer(
        {
          execute,
          schema,
          subscribe
        },
        {
          path: '/subscriptions',
          server
        }
      );
      resolve(server);
    });
  });
};
