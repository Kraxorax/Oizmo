import { Box, Button, Grid, Paper, useTheme } from "@mui/material"
import { TravelRouteInput } from "../components/TravelRouteInput";
import { useNavigate, useSearchParams } from "react-router-dom";
import dayjs from 'dayjs';
import { TravelDateInput } from "../components/TravelDateInput";
import { PassengerNumberInput } from "../components/PassengerNumberInput";
import { useTravelParams } from "../hooks/useTravelParams";


export const SearchForm = () => {
  const theme = useTheme()
  const [searchParams] = useSearchParams();
  const navigate = useNavigate()
  const { numPas,
    date,
    travelRoute,
    setNumOfPassengers,
    setDate,
    setTravelRoute } = useTravelParams()

  const navigateToResults = () => {
    navigate({ pathname: '/results', search: searchParams.toString() })
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
    <Paper sx={theme.theTheme.mainPaper}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <TravelRouteInput travelRoute={travelRoute} setTravelRoute={setTravelRoute} />
        </Grid>
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4em' }}>
            <PassengerNumberInput numOfPassengers={numPas} setNumOfPassengers={setNumOfPassengers} />
            <TravelDateInput date={date} setDate={setDate} />
          </Box>
        </Grid>
        <Grid item xs={12} md={2} sx={{ ...theme.theTheme.centered }}>
          <Button variant="contained" color="primary" fullWidth sx={{ marginTop: '2em' }} disabled={!allFieldsAreValid} onClick={navigateToResults}>Submit</Button>
        </Grid>
      </Grid>
    </Paper>
  )
}


