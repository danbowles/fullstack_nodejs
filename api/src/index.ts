import express from 'express';
const app = express();
const port = 3000;
const db = require('./db')
const middleware = require('./middleware')

const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (req, res) => {
  res.status(200).send('Valid paths: `POST /application`, `GET /application/:id`, `PUT /application/:id`');
});

app.post('/application', db.createApplication);
app.get('/application/:id', db.getApplication);

app.use(middleware.errorHandler)

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});