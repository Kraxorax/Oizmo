import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
import { TravelRoute, emptyTravelRoute } from "../models/TravelRoute";
import { useCallback } from "react";

export const useTravelParams = (): {
  numPas: number,
  date: dayjs.Dayjs,
  travelRoute: TravelRoute,
  setNumOfPassengers: (n: number) => void,
  setDate: (date: dayjs.Dayjs | null) => void,
  setTravelRoute: (travelRoute: TravelRoute) => void,
} => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const numPas = +(searchParams.get('numPas') || 1)
  const date = dayjs(searchParams.get('date') || dayjs().format('YYYY-MM-DD'))
  const travelRoute: TravelRoute = JSON.parse(searchParams.get('travelRoute') || JSON.stringify(emptyTravelRoute))

  const setNumOfPassengers = useCallback((n: number) => {
    setSearchParams((urlsp) => {
      urlsp.set('numPas', n.toString())
      return urlsp
    })
  }, [setSearchParams])

  const setDate = useCallback((date: dayjs.Dayjs | null) => {
    if (!date) return
    setSearchParams((urlsp) => {
      urlsp.set('date', date.format())
      return urlsp
    })
  }, [setSearchParams])

  const setTravelRoute = useCallback((travelRoute: TravelRoute) => {
    setSearchParams((urlsp) => {
      urlsp.set('travelRoute', JSON.stringify(travelRoute))
      return urlsp
    })
  }, [setSearchParams])

  return {
    numPas,
    date,
    travelRoute,
    setNumOfPassengers,
    setDate,
    setTravelRoute,
  }  
}
