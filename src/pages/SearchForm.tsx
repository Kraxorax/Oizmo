import { Box, Button, ButtonGroup, Paper, Typography } from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import * as dayjs from 'dayjs';
import { useState } from "react";
import { TravelRouteInput } from "../components/TravelRouteInput";


export const SearchForm = () => {
  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'row', gap: '1em', minWidth: '600px' }}>
      <TravelRouteInput />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        <NumnerOfPassengersInput />
        <DateInput />
        <Button variant="contained" color="primary">Submit</Button>
      </Box>
    </Paper>
  )
}


const DateInput = () => {
  const today = dayjs()

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker label="Date of the trip" defaultValue={today} disablePast />
    </LocalizationProvider>
  )
}


const NumnerOfPassengersInput = () => {
  const [numOfPassengers, setNumOfPassengers] = useState(1)

  return (<Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
    <Typography variant="body2">Number of passengers</Typography>
    <ButtonGroup variant="outlined" sx={{ justifyContent: 'center'}} >
      <Button onClick={() => setNumOfPassengers(n => n - 1 < 1 ? 1 : n - 1)}
        variant="contained">-</Button>
      <Box sx={{ display: 'flex', alignItems: 'center', width: '2em', justifyContent: 'center' }}>
        {numOfPassengers}
      </Box>
      <Button onClick={() => setNumOfPassengers(n => n + 1 )}
        variant="contained">+</Button>
    </ButtonGroup>
  </Box>)
}