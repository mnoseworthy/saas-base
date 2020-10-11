# React-Native + Apollo Graphiql Passport
This repository contains a base working repository that can be used to churn out SaaS apps.

## Frontend
The frontend is based on an express starter template, with login via session cookies by hitting an endpoint to passport.js on the backend. The frontend already has redux configured and working, and works on iOS Android and Browser.

## Backend
The backend is based on a Apollo backend template. I've added passportjs, graphiql, type-orm and some base-line data models for a user. The way graphiql and type-orm work together is truly beautiful.

# Usage

Start postgres database for testing:
`docker-compose up -d`

Configure an authentication provider, see backend/src/passport.ts for setup

Generate a self-signed certificate for the backend.

Edit backend config as required, see backend/src/config.ts. Everything in the file can be overridden by environment variables of the same name.

Start the backend:
`cd backend && yarn install && yarn start`

Start the frontend:
`cd app && yarn install && yarn start`

Have fun!