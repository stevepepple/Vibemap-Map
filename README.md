React & Redux app for Hotspots web and mobile prototype. 

### Run the client
The react code for the web and progressive mobile app is in client/src. It's a project 'create-react-app' boilerplate. 

    cd client
    npm install
    npm run start

    open http://localhost:3000/events

This application used React Router to serve page components. See `components/pages/main.js`. 

### Run the server

    npm install
    npm run start


## To Deploy
Push the changes to the Azure instance of the repo: 

    git push dev master
    
    ssh hotspots@app.vibemap.com

Create the react app build: 

    cd client
    npm run build

## Services
Javascript modules that handle business logic. 

## Pages
These components handle layouts and UI component includes

