import { Box, Button, Grid, Paper, useTheme } from "@mui/material"
import { TravelRouteInput } from "../components/TravelRouteInput";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TravelRoute, emptyTravelRoute } from "../models/TravelRoute";
import * as dayjs from 'dayjs';
import { TravelDateInput } from "../components/TravelDateInput";
import { PassengerNumberInput } from "../components/PassengerNumberInput";
import { useCallback } from 'react';

export const SearchForm = () => {
  const theme = useTheme()
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate()
  const numPas = +(searchParams.get('numPas') || 1)
  const date = dayjs(searchParams.get('date') || dayjs().format('YYYY-MM-DD'))
  const travelRoute: TravelRoute = JSON.parse(searchParams.get('travelRoute') || JSON.stringify(emptyTravelRoute))

  const navigateToResults = () => {
    navigate({ pathname: '/results', search: searchParams.toString() })
  }

  const setNumOfPassengers = useCallback((n: number) => {
    setSearchParams((urlsp) => {
      urlsp.set('numPas', n.toString())
      return urlsp
    })
  }, [setSearchParams])

  const setDate = useCallback((date: dayjs.Dayjs | null) => {
    if (!date) return
    setSearchParams((urlsp) => {
      urlsp.set('date', date.format('YYYY-MM-DD'))
      return urlsp
    })
  }, [setSearchParams])

  const setTravelRoute = useCallback((travelRoute: TravelRoute) => {
    setSearchParams((urlsp) => {
      urlsp.set('travelRoute', JSON.stringify(travelRoute))
      return urlsp
    })
  }, [setSearchParams])

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
            <Button variant="contained" color="primary" disabled={!allFieldsAreValid} onClick={navigateToResults}>Submit</Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}


