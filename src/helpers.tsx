/** Returns true if the file is starts with a valid encoded value. */
export const CheckEncodedImage = (encodedFile: string) => {
  let isValid = false;
  const validTypes = [
    'data:image/jpg;base64',
    'data:image/jpeg;base64',
    'data:image/png;base64'
  ];

  try {
    const start = encodedFile.split(',')[0];
    for(let validType of validTypes) {
      if(start === validType) {
        isValid = true;
        break;
      }
    }
  } catch(e) {
    return false;
  }

  return isValid;
};

/** Takes the timestamp string returned by the db and converts it into 'day month year' format. */
export const months = [
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

export const parseDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

/** Map coords to image. */
export const mapCoordsToImage = (latitude: number, longitude: number) => {
  // Defines the map as percentage where the width and height are 100% of the image size.
  const mapWidth = 100;
  const mapHeight = 100;
  // Maps the longitude or X axis.
  const x = (longitude + 180) * (mapWidth / 360)
  // Maps to radians
  latitude = latitude * Math.PI / 180;
  // Maps the latitude or y axis using mercator projection formula.
  const mercatorVal = Math.log(Math.tan((Math.PI / 4) + (latitude / 2)));
  const y = (mapHeight / 2) - (mapWidth * mercatorVal / (2 * Math.PI));
  return {latitude: y, longitude: x};
};