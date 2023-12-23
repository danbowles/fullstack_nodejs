# Fullstack NodeJS & React
[Project brief](project_brief.md) for reference.

###### Terms
Here, `application` refers to an insurance application, where `app` refers to the folder in the project.

## Up and Running!
Getting setup with the project.

### Clone this repository
`git clone git@github.com:danbowles/fullstack_nodejs.git`

### Head into the repo's main directory and get Docker running:
`cd ~/fullstack_nodejs`
`docker-compose up -d`

### Setup: Database and Schema
Once Docker has started our container, run:

`psql -h localhost -U postgres application_dev -f ./database_schema.sql`

When Prompted, input `postgres` as the password for the user.

### API and Front-End Setup
For each, it is just two commands.  First, the API:

#### Head into the API's folder from the project root and install dependencies:
`cd api`

`npm i`

#### Start up the server and you'll see it running:
`npm run dev`

```
[nodemon] 3.0.2
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/**/*
[nodemon] watching extensions: ts
[nodemon] starting `tsc && node dist/index.js`
🚀 Server running: http://localhost:3000
```

#### Head into the `app` folder and install dependencies:
`cd ../app`

`npm i`

#### Start up the app server and you'll see it running:
`npm run dev`

```
VITE v5.0.10  ready in 329 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```
### Using the application
In the browser of your choice, head to:
`http://localhost:5173` 

(the port may be different, check the VITE output when starting the app)

#### Create an Application
Once the form is filled out, hit `Create Application`.  If the input is valid, you will be given a link to add more information.

This link may be used to continue an application in the future.

#### Updating and Validating Applications
After successful creation, applications are in a 'new' state and must be updated prior to validation.  This is assumed business logic that can easily be removed.

Once an application is updated, you may validate it.  After validation, you are given a quote.  If validation is attempted again, you will be given an error as your application is already valid.

Subsequent updates to the application after validation

This link may be used to continue an application in the future.
### A Note on Stretch Goals
#### TypeScript
While the desire to have a fully-typed (strictly) implementation would be preferred, the time was a limiting factor.  Given the time, a fully-typed API and app implementation would have been delivered.
#### Additional Applicants
The Schema exists to support more applicants for an application.  Again, time was a limiting factor here.  The implementation would be much similar to that of the adding/removing of vehicles.  One difference, however, would be the use of a reducer or multiple reducers to more easily refactor the state management out of the component and into some custom hooks. 
