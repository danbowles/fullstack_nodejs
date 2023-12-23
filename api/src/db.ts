import { log } from "console";

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'application_dev',
  password: 'postgres',
  port: 5432,
})

const updateApplicationApplicant = async (id: number, firstName: string, lastName: string, dateOfBirth: string) => {
  await pool.query(
    'UPDATE application SET first_name = $1, last_name = $2, date_of_birth = $3, status = $4 WHERE id = $5',
    [firstName, lastName, dateOfBirth, "incomplete", id]
  )
}

const updateApplicationAddress = async (id: number, address: any) => {
  await pool.query(
    `INSERT INTO application_address (application_id, street, city, state, zip_code) VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (application_id) DO UPDATE SET street = $2, city = $3, state = $4, zip_code = $5`,
    [id, address.street, address.city, address.state, address.zipCode]
  );
}

const updateApplicationVehicles = async (id: number, vehicles: any) => {
  if (vehicles.length > 3) {
    throw new Error('Applications cannot have more than three vehicles');
  }

  // Note @dan: Ideally, we would want to update the vehicles if they already exist
  // and insert them if they don't. For this exercise, we'll just delete all vehicles first.
  // This may not be the best approach for a production application as we could rapidly increase the Id sequence.
  await pool.query('DELETE FROM application_vehicle WHERE application_id = $1', [id]);

  for (const vehicle of vehicles) {
    await pool.query(
      `INSERT INTO application_vehicle (application_id, vehicle_make, vehicle_model, vehicle_year, vehicle_vin) VALUES ($1, $2, $3, $4, $5)`,
      [id, vehicle.make, vehicle.model, vehicle.year, vehicle.vin]
    );
  }
}

const createApplication = async (req: any, res: any, next: any) => {
  try {
    const newApplication = req.body;

    // Note @dan: For the sake of simplicity, initial applications only require
    // the following fields: firstName, lastName, dateOfBirth
    const { firstName, lastName, dateOfBirth } = newApplication;

    const insertQuery = 'INSERT INTO application (first_name, last_name, date_of_birth, status) VALUES ($1, $2, $3, $4) RETURNING id';

    const result = await pool.query(insertQuery, [
      firstName,
      lastName,
      dateOfBirth,
      'new'
    ]);

    const newApplicationId = result.rows[0].id;

    res.status(201).json({
      message: 'Object created successfully',
      link: `http://localhost:3000/application/${newApplicationId}`,
      newApplicationId: newApplicationId
    });
  } catch (err: any) {
    next(err);
  }
}

const getApplication = async (req: any, res: any, next: any) => {
  const id = req.params.id;

  const selectQuery = `
    SELECT * FROM application app
    LEFT JOIN application_address addr ON app.id = addr.application_id
    LEFT JOIN application_vehicle vehi on app.id = vehi.application_id

    WHERE app.id = $1`;

  try {
    const result = await pool.query(selectQuery, [id]);
    const application = result.rows[0];

    // If multiple vehicles exist, group them together
    if (application) {
      const vehicles = result.rows.map((row: any) => {
        return {
          make: row.vehicle_make,
          model: row.vehicle_model,
          year: row.vehicle_year,
          vin: row.vehicle_vin,
        }
      }).filter((vehicle: any) => vehicle.make);

      application.vehicles = vehicles;
    }

    if (application) {
      const applicationResponse = {
        status: application.status,
        applicant: {
          firstName: application.first_name,
          lastName: application.last_name,
          dateOfBirth: application.date_of_birth
        },
        address: application.street ? {
          street: application.street,
          city: application.city,
          state: application.state,
          zipCode: application.zip_code,
        } : null,
        // Note @dan: Filter call is used to not return an array full of nulls :)
        vehicles: result.rows.map((row: any) => ({
          make: row.vehicle_make,
          model: row.vehicle_model,
          year: row.vehicle_year,
          vin: row.vehicle_vin,
        })).filter((vehicle: any) => vehicle.make),
      };
      res.json(applicationResponse);
    } else {
      res.status(404).send('Application not found');
    }
  } catch (err) {
    next(err);
  }
};

const updateApplication = async (req: any, res: any, next: any) => {
  try {
    const id = req.params.id;
    const updatedApplication = req.body;
    const { firstName, lastName, dateOfBirth } = updatedApplication;

    const selectQuery = `
    SELECT * FROM application app
    WHERE app.id = $1`;

    const result = await pool.query(selectQuery, [id]);
    const { status } = result.rows[0] || {};

    if (!updatedApplication || Object.keys(updatedApplication).length === 0 || !status) {
      throw new Error('Application must be provided');
    }

    // Begin a transaction
    await pool.query('BEGIN');

    try {
      // Note @dan: For simplicity, we always want to ensure we keep the application status as "incomplete"
      // when updating the application until they submit it.
      await updateApplicationApplicant(id, firstName, lastName, dateOfBirth);

      // Insert or update an application's address
      if (updatedApplication.address) {
        await updateApplicationAddress(id, updatedApplication.address);
      }

      // If an array of vehicles exists and is not empty, insert or update each vehicle
      // If there are more than three vehicles, throw an error
      if (updatedApplication.vehicles && updatedApplication.vehicles.length > 0) {
        await updateApplicationVehicles(id, updatedApplication.vehicles)
      }

      await pool.query('COMMIT');
      res.status(200).json({ message: 'Application updated successfully' });
    } catch (err) {
      await pool.query('ROLLBACK');
      next(err);
    }
    // Catch error if beginning the transaction fails
  } catch (err) {
    next(err);
  }
};

const validateApplication = async (req: any, res: any, next: any) => {
  try {
    const id = req.params.id;
    const application = req.body;
    log(application)
    const { firstName, lastName, dateOfBirth } = application;

    // We need to see if the application exists before we can validate it
    const selectQuery = `
    SELECT * FROM application app
    WHERE app.id = $1`;

    const result = await pool.query(selectQuery, [id]);
    const { status } = result.rows[0] || {};

    if (!application || Object.keys(application).length === 0 || !status) {
      throw new Error('Application must be provided');
    }

    // Begin a transaction
    await pool.query('BEGIN');

    try {
      // Note @dan: We could probably skip this and have applications start as `incomplete`
      if (status === 'new') {
        throw new Error('Application must be updated before it can be validated');
      }

      if (status === 'valid') {
        throw new Error('Application has already been validated');
      }

      // Attempt to update each portion of the application
      // If any of these fail, the transaction will be rolled back
      await updateApplicationApplicant(id, firstName, lastName, dateOfBirth);

      if (!application.address) {
        throw new Error('Application must have an address');
      } else {
        await updateApplicationAddress(id, application.address);
      }

      if (!application.vehicles || application.vehicles.length === 0) {
        throw new Error('Application must have at least one vehicle');
      } else {
        await updateApplicationVehicles(id, application.vehicles)
      }

      // If we made it here, we can mark the application as validated
      await pool.query(
        'UPDATE application SET status = $1 WHERE id = $2',
        ['valid', id]
      );

      await pool.query('COMMIT');
      res.status(200).json({ message: 'Application validated successfully' });
    } catch (err) {
      await pool.query('ROLLBACK');
      next(err);
    }
    // Catch error if beginning the transaction fails
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createApplication,
  getApplication,
  updateApplication,
  validateApplication
}