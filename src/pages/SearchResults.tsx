import dayjs from "dayjs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TravelRoute, emptyTravelRoute } from "../models/TravelRoute";
import { Button, Grid, Paper, Typography, useTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { getDistances } from "../services/FakeBacked";
import { SpanAccent } from "../components/SpanAccent";
import zip from 'lodash/zip'
import AdjustIcon from '@mui/icons-material/Adjust';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlaceIcon from '@mui/icons-material/Place';


export const SearchResults = () => {
  const theme = useTheme()
  const [searchParams, _setSearchParams] = useSearchParams();
  const navigate = useNavigate()
  const numberOfPassengers = +(searchParams.get('numPas') || 1)
  const date = dayjs(searchParams.get('date') || dayjs())
  const travelRoute: TravelRoute = useMemo(() => JSON.parse(searchParams.get('travelRoute') || JSON.stringify(emptyTravelRoute)), [searchParams])

  const [distances, setDistances] = useState<number[]>([])

  //TODO: use a loading state, kill useEffect
  useEffect(() => {
    const cities = [travelRoute.origin, ...travelRoute.destinations].map(city => city.name)

    getDistances(cities).then(distances => {
      setDistances(distances)
    }).catch(error => {
      console.error('error', error)
    })

  }, [travelRoute.destinations, travelRoute.origin])

  const totalDistance = distances.reduce((acc, distance) => acc + distance, 0).toFixed(2)

  const distanceComponents = distances.map((distance, index) => (
    <Grid item container key={index + distance} xs={12}>
      <Grid item xs={5} sx={{ textAlign: 'right'}}>
        <Typography variant="body2"><SpanAccent>{`${distance.toFixed(2)} km`}</SpanAccent></Typography>
      </Grid>
      <Grid item xs={1} sx={{ textAlign: 'center'}}>
        <MoreVertIcon fontSize="small"/>
      </Grid>
      <Grid item xs={6} >
      </Grid>
    </Grid>
  ))

  const allCities = [travelRoute.origin.name, ...travelRoute.destinations.map(c => c.name)]

  const cityComponents = allCities.map((city, index) => (
    <Grid item container xs={12} key={index + city}>
      <Grid item xs={5}></Grid>
      <Grid item xs={1} sx={{ textAlign: 'center'}}>
        {index < allCities.length - 1
          ? <AdjustIcon fontSize="small"/>
          : <PlaceIcon fontSize="small"/>}
      </Grid>
      <Grid item xs={6} sx={{ textAlign: 'left'}}>
        <Typography variant="body2">{city}</Typography>
      </Grid>
    </Grid>
  ))

  const citiesAndDistances = zip(cityComponents, distanceComponents)

  return (
  <Paper sx={theme.theTheme.mainPaper}>
    <Grid container spacing={4}>
      <Grid container item md={8} spacing={0} sx={theme.theTheme.centered}>
        {citiesAndDistances}
      </Grid>
      <Grid container item md={8} spacing={2} sx={theme.theTheme.centered}>
        <Grid item xs={12} sx={theme.theTheme.centered}>
          <Typography variant="body2"><SpanAccent>{totalDistance} km</SpanAccent> is total distance</Typography>
        </Grid>
        <Grid item xs={12} sx={theme.theTheme.centered}>
          <Typography variant="body2"><SpanAccent>{numberOfPassengers}</SpanAccent> passengers</Typography>
        </Grid>
        <Grid item xs={12} sx={theme.theTheme.centered}>
          <Typography variant="body2"><SpanAccent>{date.format('MMM DD, YYYY')}</SpanAccent></Typography>
        </Grid>
        <Grid item xs={12} md={3} sx={theme.theTheme.centered}>
          <Button variant="contained" color="primary" 
            fullWidth
            onClick={() => navigate({ pathname: '/', search: searchParams.toString()})}>
              Back
          </Button>
        </Grid>
      </Grid>
    </Grid>
  </Paper>);
}