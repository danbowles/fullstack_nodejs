import express from 'express';
const app = express();
const port = 3000;
const cors = require('cors');
const db = require('./db')
const middleware = require('./middleware')

const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(cors())
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
app.put('/application/:id', db.updateApplication);
app.post('/application/validate/:id', db.validateApplication);

app.use(middleware.errorHandler)

app.listen(port, () => {
  return console.log(`🚀 Server running: http://localhost:${port}`);
});