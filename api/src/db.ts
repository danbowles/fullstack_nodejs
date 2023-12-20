const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'application_dev',
  password: 'postgres',
  port: 5432,
})

const createApplication = async (req: any, res: any, next: any) => {
  try {
    const newApplication = req.body;

    const insertQuery = 'INSERT INTO application (first_name, last_name, date_of_birth, status) VALUES ($1, $2, $3, $4) RETURNING id';

    const result = await pool.query(insertQuery, [
      newApplication.firstName,
      newApplication.lastName,
      newApplication.dateOfBirth,
      'new'
    ]);

    const newApplicationId = result.rows[0].id;

    res.status(201).json({
      message: 'Object created successfully',
      link: `http://localhost:3000/application/${newApplicationId}`,
    });
  } catch (err: any) {
    next(err);
  }
}

const getApplication = async (req: any, res: any, next: any) => {
  const id = req.params.id;

  const selectQuery = 'SELECT * FROM application WHERE id = $1';

  try {
    const result = await pool.query(selectQuery, [id]);
    const application = result.rows[0];

    if (application) {
      res.json(application);
    } else {
      res.status(404).send('Object not found');
    }
  } catch (err) {
    next(err);
  }
};

// const updateApplication = async (req: any, res: any) => {
//   const id = req.params.id;
//   const updatedApplication = req.body;

//   await pool.query('BEGIN');

//   try {
//     // Update the main table
//     const updateResult = await pool.query(
//       'UPDATE application SET first_name = $1, column2 = $2, ... WHERE id = $3',
//       [updatedData.column1, updatedData.column2, /* ...other values */, id]
//     );
//   }

module.exports = {
  createApplication,
  getApplication
}