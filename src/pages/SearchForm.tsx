import { Box, Button, ButtonGroup, Paper, Typography } from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import * as dayjs from 'dayjs';
import { TravelRouteInput } from "../components/TravelRouteInput";
import { useSearchParams } from "react-router-dom";

export type TravelRoute = {
  origin: string
  destinations: string[]
}

const emptyTravelRoute: TravelRoute = {
  origin: '',
  destinations: [''],
}

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
        <NumberOfPassengersInput numOfPassengers={numPas} setNumOfPassengers={setNumOfPassengers} />
        <DateInput date={date} setDate={setDate} />
        <Button variant="contained" color="primary">Submit</Button>
      </Box>
    </Paper>
  )
}


const DateInput = (props: { date: dayjs.Dayjs, setDate: (date: dayjs.Dayjs | null) => void }) => {
  const { date, setDate } = props

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker label="Date of the trip" defaultValue={date} onChange={setDate} disablePast />
    </LocalizationProvider>
  )
}


const NumberOfPassengersInput = (props: {numOfPassengers: number, setNumOfPassengers: (n: number) => void }) => {
  const { numOfPassengers, setNumOfPassengers } = props

  return (<Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
    <Typography variant="body2">Number of passengers</Typography>
    <ButtonGroup variant="outlined" sx={{ justifyContent: 'center'}} >
      <Button onClick={() => setNumOfPassengers(numOfPassengers - 1 < 1 ? 1 : numOfPassengers - 1)}
        variant="contained">-</Button>
      <Box sx={{ display: 'flex', alignItems: 'center', width: '2em', justifyContent: 'center' }}>
        {numOfPassengers}
      </Box>
      <Button onClick={() => setNumOfPassengers(numOfPassengers + 1 )}
        variant="contained">+</Button>
    </ButtonGroup>
  </Box>)
}