-- Drop all tables at the start
DROP TABLE IF EXISTS application_vehicle;
DROP TABLE IF EXISTS application_address;
DROP TABLE IF EXISTS application_additional_vehicle;
DROP TABLE IF EXISTS application_additional_driver;
DROP TABLE IF EXISTS application CASCADE;

-- Start table Creation

CREATE TABLE application (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  CHECK (date_of_birth <= CURRENT_DATE - INTERVAL '16 years'),
  status VARCHAR(10) CHECK (status IN ('new', 'incomplete', 'valid'))
);

CREATE TABLE application_address (
  id SERIAL PRIMARY KEY,
  application_id INTEGER NOT NULL UNIQUE,
  street VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(2) NOT NULL,
  zip_code VARCHAR(5) NOT NULL,
  FOREIGN KEY (application_id) REFERENCES application(id),
  CHECK (zip_code ~ '^[0-9]{5}$' OR zip_code ~ '^[0-9]{5}-[0-9]{4}$')
);

CREATE TABLE application_vehicle (
  id SERIAL PRIMARY KEY,
  application_id INTEGER NOT NULL,
  vehicle_vin VARCHAR(17) UNIQUE NOT NULL,
  vehicle_year NUMERIC(4) CHECK (vehicle_year >= 1985 AND vehicle_year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
  FOREIGN KEY (application_id) REFERENCES application(id),
  vehicle_make VARCHAR(255) NOT NULL,
  vehicle_model VARCHAR(255) NOT NULL
);

CREATE TABLE application_additional_driver (
  id SERIAL PRIMARY KEY,
  application_id INTEGER NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  relationship VARCHAR(32) CHECK (relationship IN ('spouse', 'sibling', 'parent', 'guardian', 'friend', 'other')),
  date_of_birth DATE NOT NULL,
  CHECK (date_of_birth <= CURRENT_DATE - INTERVAL '16 years'),
  FOREIGN KEY (application_id) REFERENCES application(id)
);