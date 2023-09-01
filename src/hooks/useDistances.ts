import { useEffect, useState } from "react"
import { TravelRoute } from "../models/TravelRoute"
import { getDistances } from "../services/FakeBacked"

export const useDistances = (travelRoute: TravelRoute) => {
  const [distances, setDistances] = useState<number[]>([])
  const [error, setError] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cities = [travelRoute.origin, ...travelRoute.destinations].map(city => city.name)

    getDistances(cities).then(distances => {
      setDistances(distances)
    }).catch(error => {
      setError(error.message)
    }).finally(() => {
      setLoading(false)
    })

  }, [travelRoute.destinations, travelRoute.origin])

  return {
    distances,
    error,
    loading,
  }
}