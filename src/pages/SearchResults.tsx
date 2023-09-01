import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, CircularProgress, Grid, Paper, Typography, useTheme } from "@mui/material";
import { SpanAccent } from "../components/SpanAccent";
import zip from 'lodash/zip'
import AdjustIcon from '@mui/icons-material/Adjust';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlaceIcon from '@mui/icons-material/Place';
import { useTravelParams } from "../hooks/useTravelParams";
import { useDistances } from "../hooks/useDistances";


const BackButton = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();

  return (
    <Grid item xs={12} md={3} sx={theme.theTheme.centered}>
      <Button variant="contained" color="primary" 
        fullWidth
        onClick={() => navigate({ pathname: '/', search: searchParams.toString()})}>
          Back
      </Button>
    </Grid>
  )
}

const ErrorView = (props: { error: string }) => {
  const { error } = props
  const theme = useTheme()

  return (
    <Grid item xs={12} sx={theme.theTheme.centered}>
      <Typography variant="body2" color="error" sx={{ margin: '3em 0'}}>{error}</Typography>
      <BackButton />
    </Grid>
  )
}

export const SearchResults = () => {
  const theme = useTheme()
  const { numPas,
          date,
          travelRoute } = useTravelParams()

  const {distances, error, loading} = useDistances(travelRoute)

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

  const errorOrLoading = error
    ? <ErrorView error={error} />
    : loading 
      ? <CircularProgress sx={{ margin: '0 auto'}} />
      : null

  return (
  <Paper sx={theme.theTheme.mainPaper}>
    { errorOrLoading 
      ? errorOrLoading
      : <Grid container spacing={4}>
          <Grid container item md={8} spacing={0} sx={theme.theTheme.centered}>
            {citiesAndDistances}
          </Grid>
          <Grid container item md={8} spacing={2} sx={theme.theTheme.centered}>
            <Grid item xs={12} sx={theme.theTheme.centered}>
              <Typography variant="body2"><SpanAccent>{totalDistance} km</SpanAccent> is total distance</Typography>
            </Grid>
            <Grid item xs={12} sx={theme.theTheme.centered}>
              <Typography variant="body2"><SpanAccent>{numPas}</SpanAccent> passengers</Typography>
            </Grid>
            <Grid item xs={12} sx={theme.theTheme.centered}>
              <Typography variant="body2"><SpanAccent>{date.format('MMM DD, YYYY')}</SpanAccent></Typography>
            </Grid>
            <BackButton />
          </Grid>
        </Grid>
    }
  </Paper>);
}