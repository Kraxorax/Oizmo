import dayjs from "dayjs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TravelRoute, emptyTravelRoute } from "../models/TravelRoute";
import { Button, Paper } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { getDistances } from "../services/FakeBacked";


export const SearchResults = () => {
  const [searchParams, _setSearchParams] = useSearchParams();
  const navigate = useNavigate()
  const numberOfPassengers = +(searchParams.get('numPas') || 1)
  const date = dayjs(searchParams.get('date') || dayjs())
  const travelRoute: TravelRoute = useMemo(() => JSON.parse(searchParams.get('travelRoute') || JSON.stringify(emptyTravelRoute)), [searchParams])

  const [distances, setDistances] = useState<number[]>([])

  useEffect(() => {
    const cities = [travelRoute.origin, ...travelRoute.destinations].map(city => city.name)

    getDistances(cities).then(distances => {
      console.log('distances', distances)
      setDistances(distances)
    }).catch(error => {
      console.error('error', error)
    })
    
  }, [travelRoute.destinations, travelRoute.origin])

  const totalDistance = distances.reduce((acc, distance) => acc + distance, 0).toFixed(2)

  return (<Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: '1em', minWidth: '600px' }}>
    <ul>
      {distances.map((distance, index) => <li key={index}>{distance}</li>)}
    </ul>
    <p>{totalDistance} km is total distance</p>
    <p>{numberOfPassengers} passengers</p>
    <p>{date.format('MMM DD, YYYY')}</p>
    <Button variant="contained" color="primary" onClick={() => navigate({ pathname: '/', search: searchParams.toString()})}>Back</Button>
  </Paper>);
}