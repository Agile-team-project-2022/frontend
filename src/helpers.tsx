/** Returns true if the file is starts with a valid encoded value. */
export const CheckEncodedImage = (encodedFile: string) => {
  let isValid = false;
  const validTypes = [
    'data:image/jpg;base64',
    'data:image/jpeg;base64',
    'data:image/png;base64'
  ];
  const start = encodedFile.split(',')[0];

  if(validTypes.includes(start)) isValid = true;

  return isValid;
};

/** Takes the timestamp string returned by the db and converts it into 'day month year' format. */
export const parseDate = (dateString: string) => {
  const date = new Date(dateString);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};