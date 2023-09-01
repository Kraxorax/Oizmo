import { Autocomplete, Button, TextField, AutocompleteInputChangeReason, Tooltip, Grid } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { SyntheticEvent, useCallback, useMemo, useState } from "react"
import { numberToOrdinalString } from "../utils/TextManipulation"
import { debounce } from "lodash"
import { findCity } from "../services/FakeBacked"
import { CityEntry, TravelRoute, TravelRouteKey } from '../models/TravelRoute';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const debounceTime = 500

export const TravelRouteInput = (props: { travelRoute: TravelRoute, setTravelRoute: (tr: TravelRoute) => void}) => {
  const { travelRoute, setTravelRoute } = props

  const [availableCityOptions, setAvailableCityOptions] = useState<string[]>([])
  const [optionsAreLoading, setOptionsAreLoading] = useState(false)

  const updateTravelRoute = useCallback((updater: (travelRoute: TravelRoute) => TravelRoute) => {
    setTravelRoute(updater(travelRoute))
  }, [setTravelRoute, travelRoute])

  const updateTravelRouteAtKey = useCallback((key: TravelRouteKey, value: CityEntry) => {
    if (key === 'origin') {
      updateTravelRoute(travelRoute => ({ ...travelRoute, origin: value }))
    } else {
      const index = parseInt(key.split('-')[1])
      const newDestinations = [...travelRoute.destinations]
      newDestinations[index] = value
      updateTravelRoute(travelRoute => ({ ...travelRoute, destinations: newDestinations }))
    }
  }, [travelRoute.destinations, updateTravelRoute])

  const onCityInputChange = useCallback((travelRouteKey: TravelRouteKey) => 
    debounce((_e: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
      if (!value || value.length === 0 || reason === 'reset') {
        setAvailableCityOptions(() => [])
        return
      }

      setOptionsAreLoading(true)

      findCity(value).then(cities => {
        setAvailableCityOptions(cities)
      }).catch((error) => {
        setAvailableCityOptions(() => [])
        updateTravelRouteAtKey(travelRouteKey, { name: value, error: error.message })
      }).finally(() => {
        setOptionsAreLoading(false)
      })
    }, debounceTime), [updateTravelRouteAtKey])
  

  const onCitySelect = useCallback((travelRouteKey: TravelRouteKey) => 
    (_e: SyntheticEvent<Element, Event>, value: string | null,) => {
      updateTravelRouteAtKey(travelRouteKey, { name: value || '' })
      setAvailableCityOptions(() => [])
    }, [updateTravelRouteAtKey])


  const onAddNextDestination = useCallback(() => {
    updateTravelRoute(travelRoute => ({ ...travelRoute, destinations: [...travelRoute.destinations, { name: ''}] }))
  }, [updateTravelRoute])

  const onRemoveDestination = useCallback((index: number) => {
    const newDestinations = [...travelRoute.destinations]
    newDestinations.splice(index, 1)
    updateTravelRoute(travelRoute => ({ ...travelRoute, destinations: newDestinations }))
  }, [travelRoute.destinations, updateTravelRoute])

  const onAutocompleteBlur = useCallback(() => {
    setAvailableCityOptions(() => [])
  }, [])


  const allDestinationsAutocompletes = useMemo(() => travelRoute.destinations.map((cityEntry, index) => { 
    const label = travelRoute.destinations.length === 1 
      ? 'Destination city' 
      : `${numberToOrdinalString(index + 1)} destination`

    const removeButton = travelRoute.destinations.length > 1
      ? <Grid item xs={1}> 
          <Tooltip title={'Remove destination'} enterDelay={2000}>
            <Button variant="text" tabIndex={-1} sx={{ minWidth: '0px' }}
              onClick={() => onRemoveDestination(index)}>
              <RemoveCircleOutlineIcon />
            </Button>
          </Tooltip>
        </Grid>
      : null

    const travelRouteKey = `destination-${index}` as TravelRouteKey

    const error = { helperText: cityEntry.error, error: !!cityEntry.error }

    return ( //sx={{ display: 'flex', flexDirection: 'row', gap: '1em', alignItems: 'start' }} key={`destination-${index}`}
      <Grid container item xs={12}>
        <Grid item xs={removeButton ? 11 : 12}>
          <Autocomplete id={`travel-route-${index}`}
            key={travelRouteKey}
            options={availableCityOptions}
            value={cityEntry.name}
            onInputChange={onCityInputChange(travelRouteKey)}
            onChange={onCitySelect(travelRouteKey)}
            onBlur={onAutocompleteBlur}
            isOptionEqualToValue={() => true}
            filterOptions={x => x}
            loading={optionsAreLoading}
            fullWidth
            sx={{ height: '100%' }}
            renderInput={(params) => <TextField {...params} label={label} variant="outlined" size="small" {...error}/>}
            />
        </Grid>
        {removeButton}
      </Grid>
    )
  }), [availableCityOptions, onAutocompleteBlur, onCityInputChange, onCitySelect, onRemoveDestination, optionsAreLoading, travelRoute.destinations])

  const error = { helperText: travelRoute.origin.error, error: !!travelRoute.origin.error }
 
  return ( //sx={{ display: 'flex', flexDirection: 'column', gap: '1em', flexGrow: 5 }}
    <Grid container item xs={12} md={8} spacing={1}>
      <Grid item xs={12} sx={{ margin: 0}}>
        <Autocomplete id={`travel-route-origin`}
          options={availableCityOptions}
          value={travelRoute.origin.name}
          onInputChange={onCityInputChange('origin')}
          onChange={onCitySelect('origin')}
          onBlur={onAutocompleteBlur}
          isOptionEqualToValue={() => true}
          filterOptions={x => x}
          loading={optionsAreLoading}
          renderInput={(params) => <TextField {...params} label={'City of origin'} variant="outlined" size="small" {...error} />}
          fullWidth
          />
      </Grid>
      {allDestinationsAutocompletes}
      
      <Grid item xs={12}>
        <Button variant="text" onClick={onAddNextDestination} startIcon={<AddCircleOutlineIcon />}>Add destination</Button>
      </Grid>
    </Grid>
  )
}
