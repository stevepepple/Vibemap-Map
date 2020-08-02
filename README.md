React & Redux app for Vibemap web and mobile prototype. 

The app is written in React and uses Server-Side Rendering (SSR) for a universal, improved browser and SEO performance. It uses the Razzle and After.js framework, which is similar to Gatsby and Next.js, but with less configuration and better integration with React Router and React Redux. The conventions and developer experience are also similar to React Create App, which is the boilerplate the project was started with.

The app and components are 'isomorphic" and 
The razzle.config.js file is used to make changes to the default webpack and other configurations. 

###Run the build
The react code for the web and progressive mobile app is in client/src. It's a project 'create-react-app' boilerplate.

To run the app with yarn or npm:

```bash
yarn install 
yarn dev
```
App will start on port 8080 or the port that you have configured in `env.PORT`.

There are a couple of secret keys that you need to add to the `.env` environtment variable read by React in both development and production mode.

Build and deploy the app. 

```bash
yarn build
yarn start
```

Or simply running `node build/server.js`. 

This command compiles the app into a production-ready build using webpack and babel to transpile the code. 

To analyze the build package and look dependencies sizes, run `yarn analyze`. 

The build file can then be deploy to an Azure web app or other container running Node version 12. 


###App Organization

- routes.js

## Services
Javascript modules that handle business logic. 

## Pages
These components handle layouts and UI component includes

## Internationalization

### Map
