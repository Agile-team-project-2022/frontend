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
