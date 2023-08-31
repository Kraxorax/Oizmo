type City = [string, number, number]

const earthRadius = 6371; // Radius of the earth in km

const citiesDB: City[] = [
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
  const cityToSearch = name.toLowerCase().trim();

  if (cityToSearch === 'fail') {
    throw new Error('Oops, something went wrong')
  }

  const foundCities = citiesDB
    .filter(city => city[0].toLowerCase().includes(cityToSearch))
    .map(city => city[0])

  await wait(500)

  return foundCities
}


export const getDistances = async (cityNames: string[]) => {
  if (cityNames.findIndex(city => city[0] === 'Dijon') > -1) {
    throw new Error('Dijon is not a real city')
  }

  const distances = []
  for (let i = 1; i < cityNames.length; i++) {
    const startCityName = cityNames[i-1]
    const endCityName = cityNames[i]
    const startCity = citiesDB.find(city => city[0] === startCityName)
    const endCity = citiesDB.find(city => city[0] === endCityName)

    if (!startCity || !endCity) {
      throw new Error('City not found')
    }

    const distance = getDistanceFromLatLonInKm(startCity[1], startCity[2], endCity[1], endCity[2])
    distances.push(distance)
  }

  await wait(1000)

  return distances
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