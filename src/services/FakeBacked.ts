type City = [string, number, number]

const earthRadius = 6371; // Radius of the earth in km

const cities: City[] = [
  ['Paris', 48.856614, 2.352222],
  ['Marseille', 43.296482, 5.369780],
  ['Lyon', 45.764043, 4.835659],
  ['Toulouse', 43.604652, 1.444209],
  ['Nice', 43.710173, 7.261953],
  ['Nantes', 47.218371, -1.553621],
  ['Strasbourg', 48.573405, 7.752111],
  ['Montpellier', 43.610769, 3.876716],
  ['Bordeaux', 44.837789, -0.579180],
  ['Lille', 50.629250, 3.057256],
  ['Rennes', 48.117266, -1.677793],
  ['Reims', 49.258329, 4.031696],
  ['Le Havre', 49.494370, 0.107929],
  ['Saint-Étienne', 45.439695, 4.387178],
  ['Toulon', 43.124228, 5.928000],
  ['Angers', 47.478419, -0.563166],
  ['Grenoble', 45.188529, 5.724524],
  ['Dijon', 47.322047, 5.041480],
  ['Nîmes', 43.836699, 4.360054],
  ['Aix-en-Provence', 43.529742, 5.447427],
  ['Belgrade', 44.786568, 20.448922],
]


export const findCity = async (name: string) => {
  const cityToSerach = name.toLowerCase().trim();

  if (cityToSerach === 'fail') {
    throw new Error('City not found')
  }

  const foundCities = cities.filter(city => city[0].toLowerCase().includes(cityToSerach))

  console.log('querying city', cityToSerach, 'found', foundCities)

  await wait(500)
  return foundCities
}


export const getDistance = async (city1: City, city2: City) => {
  if (city1[0] === 'Dijon' && city2[0] === 'Dijon') {
    throw new Error('Dijon is not a city')
  }

  const distance = getDistanceFromLatLonInKm(city1[1], city1[2], city2[1], city2[2])
  await wait(1000)
  return distance
}

// Haversine formula
const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const p = Math.PI / 180

  const a = 0.5 - Math.cos((lat2 - lat1) * p) / 2
                + Math.cos(lat1 * p) * Math.cos(lat2 * p) *
                  (1 - Math.cos((lon2 - lon1) * p)) / 2;

  return 2 * earthRadius * Math.asin(Math.sqrt(a))
}

// nice wait function
const wait = (msec: number) => new Promise((resolve) => {
  setTimeout(resolve, msec);
});