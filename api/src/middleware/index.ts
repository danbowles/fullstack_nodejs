const errorStringMap: any = {
  state: 'State',
  zip_code: 'Zip code',
  street: 'Street address',
  city: 'City',
  vehicle_vin: 'Vehicle VIN',
  vehicle_year: 'Vehicle year',
  vehicle_make: 'Vehicle make',
  vehicle_model: 'Vehicle model',
  first_name: 'First name',
  last_name: 'Last name',
  date_of_birth: 'Date of birth',
  invalid_datetime_format: 'Invalid format for applicant\'s date of birth; expected format: YYYY-MM-DD',
  application_date_of_birth_check: 'Applicant must be at least 16 years old',
  application_vehicle_vehicle_year_check: 'Vehicle year must be between 1985 and no more than a year in the future',
  application_address_zip_code_check: 'Zip code must be 5 digits',
  application_vehicle_vehicle_vin_key: 'Vehicle VIN must be unique',
}

const tableNameMap: any = {
  application: 'Applicant',
  application_vehicle: 'Vehicle',
  application_address: 'Address',
}

const errorHandler = (err: any, req: any, res: any, next: any) => {
  console.error('Error creating object:', err);
  switch (err.code) {
    case "22001":
      // Note @dan: This is not the ideal way to handle a state's length being too long
      if (err.message.includes('varying(2)')) {
        return res.status(400).send(`
          ${tableNameMap.application_address}: value too long for State; max length 2`
        );
      } else if (err.message.includes('varying(17)')) {
        return res.status(400).send(`
          ${tableNameMap.application_vehicle}: value too long for VIN; max length 17`
        );
      } else {
        return res.status(400).send(`An entered value was too long`);
      }
    case '23502':
      return res.status(400).send(`
        ${tableNameMap[err.table]}: 
        ${errorStringMap[err.column]} is required`
      );
    case '23505':
      return res.status(400).send(errorStringMap[err.constraint]);
    case '22007':
      return res.status(400).send(errorStringMap.invalid_datetime_format);
    case '23514':
      return res.status(400).send(errorStringMap[err.constraint]);
    default:
      return res.status(400).send(err.message || 'An error occurred');
  }
}

module.exports = {
  errorHandler
}