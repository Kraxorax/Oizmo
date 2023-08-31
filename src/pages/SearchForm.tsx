import { Box, Button, Paper } from "@mui/material"
import { TravelRouteInput } from "../components/TravelRouteInput";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TravelRoute, emptyTravelRoute } from "../models/TravelRoute";
import * as dayjs from 'dayjs';
import { TravelDateInput } from "../components/TravelDateInput";
import { PassengerNumberInput } from "../components/PassengerNumberInput";

export const SearchForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate()
  const numPas = +(searchParams.get('numPas') || 1)
  const date = dayjs(searchParams.get('date') || dayjs().format('YYYY-MM-DD'))
  const travelRoute: TravelRoute = JSON.parse(searchParams.get('travelRoute') || JSON.stringify(emptyTravelRoute))

  const navigateToResults = () => {
    navigate({ pathname: '/results', search: searchParams.toString() })
  }

  const setNumOfPassengers = (n: number) => {
    setSearchParams((urlsp) => {
      urlsp.set('numPas', n.toString())
      return urlsp
    })
  }

  const setDate = (date: dayjs.Dayjs | null) => {
    if (!date) return
    setSearchParams((urlsp) => {
      urlsp.set('date', date.format('YYYY-MM-DD'))
      return urlsp
    })
  }

  const setTravelRoute = (travelRoute: TravelRoute) => {
    setSearchParams((urlsp) => {
      urlsp.set('travelRoute', JSON.stringify(travelRoute))
      return urlsp
    })
  }

  const noErrorsInTravelRoute = !travelRoute.origin.error &&
    travelRoute.destinations.every(destination => !destination.error)

  const isValidPassengerNumber = numPas >= 1

  const isValidDate = !date.isBefore(dayjs(), 'day')

  const allFieldsAreValid = noErrorsInTravelRoute && travelRoute.origin.name.length > 0 &&
    travelRoute.destinations.every(destination => destination.name.length > 0) &&
    isValidPassengerNumber &&
    isValidDate

  console.log('validity', noErrorsInTravelRoute, isValidPassengerNumber, isValidDate)

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'row', gap: '1em', minWidth: '600px' }}>
      <TravelRouteInput travelRoute={travelRoute} setTravelRoute={setTravelRoute} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        <PassengerNumberInput numOfPassengers={numPas} setNumOfPassengers={setNumOfPassengers} />
        <TravelDateInput date={date} setDate={setDate} />
        <Button variant="contained" color="primary" disabled={!allFieldsAreValid} onClick={navigateToResults}>Submit</Button>
      </Box>
    </Paper>
  )
}


