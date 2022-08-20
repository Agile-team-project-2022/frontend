import badgeImg1 from '../src/assets/badge-1.jpeg';
import badgeImg2 from '../src/assets/badge-2.jpeg';
import badgeImg3 from '../src/assets/badge-3.jpeg';
import badgeImg4 from '../src/assets/badge-4.jpeg';
import badgeImg5 from '../src/assets/badge-5.jpeg';
import badgeImg6 from '../src/assets/badge-6.jpeg';

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

/** Calculates the experience (number of stars) based on number of plants, friends, and posts. */
export const getExperience = (totalPlants: number, totalFriends: number, totalPosts: number) => {
  const maxStars = 5;
  // Values for having max stars.
  const maxPlantsConsidered = 200;
  const maxFriendsConsidered = 100;
  const maxPostsConsidered = 200;

  const mappedPlants = (totalPlants) * (maxStars) / (maxPlantsConsidered);
  const mappedFriends = (totalFriends) * (maxStars) / (maxFriendsConsidered);
  const mappedPosts = (totalPosts) * (maxStars) / (maxPostsConsidered);

  return Math.floor((mappedPlants + mappedFriends + mappedPosts) / 3);
};

/** Calculates the badges for the owner based on joining date, total plants, posts, and friends. */
export const getBadges = (totalPlants: number, totalFriends: number, totalPosts: number) => {
  // Defines the badges and their pictures.
  enum ValidBadges {
    FRIENDLY = 'FRIENDLY',
    FIRST_PLANT = 'FIRST_PLANT',
    FIVE_PLANTS = 'FIVE_PLANTS',
    TEN_PLANTS = 'TEN_PLANTS',
    HELPFUL = 'HELPFUL',
    WELCOME = 'WELCOME'
  }

  const badgesMap = {
    [ValidBadges.WELCOME] : {name: 'Joined the app!', imageFile: badgeImg3},
    [ValidBadges.FIRST_PLANT] : {name: 'First plant!', imageFile: badgeImg6},
    [ValidBadges.FIVE_PLANTS] : {name: 'First 5 plants!', imageFile: badgeImg2},
    [ValidBadges.TEN_PLANTS] : {name: 'First 10 plants!!!', imageFile: badgeImg5},
    [ValidBadges.FRIENDLY] : {name: 'Friendly', imageFile: badgeImg4},
    [ValidBadges.HELPFUL] : {name: 'Helpful planter', imageFile: badgeImg1},
  };

  // Starts the calculations.
  const userBadges = [
    badgesMap[ValidBadges.WELCOME]
  ];

  if(totalPlants >= 1) userBadges.push(badgesMap[ValidBadges.FIRST_PLANT]);
  if(totalPlants >= 5) userBadges.push(badgesMap[ValidBadges.FIVE_PLANTS]);
  if(totalPlants >= 10) userBadges.push(badgesMap[ValidBadges.TEN_PLANTS]);
  if(totalFriends >= 1) userBadges.push(badgesMap[ValidBadges.FRIENDLY]);
  if(totalPosts >= 1) userBadges.push(badgesMap[ValidBadges.HELPFUL]);

  return userBadges;
};