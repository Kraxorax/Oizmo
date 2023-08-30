import { Box, Button, Paper } from "@mui/material"
import { TravelRouteInput } from "../components/TravelRouteInput";
import { useSearchParams } from "react-router-dom";
import { TravelRoute, emptyTravelRoute } from "../models/TravelRoute";
import * as dayjs from 'dayjs';
import { TravelDateInput } from "../components/TravelDateInput";
import { PassengerNumberInput } from "../components/PassengerNumberInput";

export const SearchForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const numPas = +(searchParams.get('numPas') || 1)
  const date = dayjs(searchParams.get('date') || dayjs().format('YYYY-MM-DD'))
  const travelRoute = JSON.parse(searchParams.get('travelRoute') || JSON.stringify(emptyTravelRoute))

  const setNumOfPassengers = (n: number) => {
    setSearchParams((prev) => {
      prev.set('numPas', n.toString())
      return prev
    })
  }

  const setDate = (date: dayjs.Dayjs | null) => {
    if (!date) return
    setSearchParams((prev) => {
      prev.set('date', date.format('YYYY-MM-DD'))
      return prev
    })
  }

  const setTravelRoute = (travelRoute: TravelRoute) => {
    setSearchParams((prev) => {
      prev.set('travelRoute', JSON.stringify(travelRoute))
      return prev
    })
  }


  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'row', gap: '1em', minWidth: '600px' }}>
      <TravelRouteInput travelRoute={travelRoute} setTravelRoute={setTravelRoute} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        <PassengerNumberInput numOfPassengers={numPas} setNumOfPassengers={setNumOfPassengers} />
        <TravelDateInput date={date} setDate={setDate} />
        <Button variant="contained" color="primary">Submit</Button>
      </Box>
    </Paper>
  )
}


