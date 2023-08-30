
export type CityEntry = {
  name: string,
  error?: string,
}

export type TravelRoute = {
  origin: CityEntry,
  destinations: CityEntry[]
}

export type TravelRouteKey = 'origin' | `destination-${number}`

export const emptyTravelRoute: TravelRoute = {
  origin: { name: '' },
  destinations: [{ name: '' }],
}
