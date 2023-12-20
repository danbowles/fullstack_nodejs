const errorStringMap: any = {
  first_name: 'First name',
  last_name: 'Last name',
  date_of_birth: 'Date of birth',
  invalid_datetime_format: 'Invalid format for applicant\'s date of birth; expected format: YYYY-MM-DD',
  application_date_of_birth_check: 'Applicant must be at least 16 years old',
}

const errorHandler = (err: any, req: any, res: any, next: any) => {
  switch (err.code) {
    case '23502':
      return res.status(400).send(`${errorStringMap[err.column]} is required`);
    case '23514':
      return res.status(400).send(errorStringMap[err.constraint]);
    case '22007':
      return res.status(400).send(errorStringMap.invalid_datetime_format);
    default:
      console.error('Error creating object:', err);
      return res.status(400).send('Invalid object data');
  }
}

module.exports = {
  errorHandler
}