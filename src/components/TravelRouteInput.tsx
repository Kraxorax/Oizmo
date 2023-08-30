import { Autocomplete, Box, Button, TextField, AutocompleteInputChangeReason } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { SyntheticEvent, useCallback, useMemo, useState } from "react"
import { numberToOrdinalString } from "../utils/TextManipulation"
import { debounce } from "lodash"
import { findCity } from "../services/FakeBacked"
import { TravelRoute } from '../pages/SearchForm';

const debounceTime = 500

export const TravelRouteInput = (props: { travelRoute: TravelRoute, setTravelRoute: (tr: TravelRoute) => void}) => {
  const { travelRoute, setTravelRoute } = props

  const [availableCityOptions, setAvailableCityOptions] = useState<string[]>([])
  const [optionsAreLoading, setOptionsAreLoading] = useState(false)

  const updateTravelRoute = useCallback((updater: (travelRoute: TravelRoute) => TravelRoute) => {
    setTravelRoute(updater(travelRoute))
  }, [setTravelRoute, travelRoute])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onCityInputChange = useCallback(debounce((_e: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
      if (!value || value.length === 0 || reason === 'reset') {
        setAvailableCityOptions(() => [])
        return
      }

      setOptionsAreLoading(true)

      findCity(value).then(cities => {
        console.log('setting options', cities, reason)
        setAvailableCityOptions(cities.map(city => city[0]))
        setOptionsAreLoading(false)
      })
    }, debounceTime), [])
  

  const onCitySelect = useCallback((travelRouteKey: string) => (_e: SyntheticEvent<Element, Event>, value: string | null,) => {
    if (travelRouteKey === 'origin') {
      updateTravelRoute(travelRoute => ({ ...travelRoute, origin: value || '' }))
    } else {
      const index = parseInt(travelRouteKey.split('-')[1])
      const newDestinations = [...travelRoute.destinations]
      newDestinations[index] = value || ''
      updateTravelRoute(travelRoute => ({ ...travelRoute, destinations: newDestinations }))
    }
    setAvailableCityOptions(() => [])
  }, [travelRoute.destinations, updateTravelRoute])


  const onAddNextDestination = useCallback(() => {
    updateTravelRoute(travelRoute => ({ ...travelRoute, destinations: [...travelRoute.destinations, ''] }))
  }, [updateTravelRoute])

  const onRemoveDestination = useCallback((index: number) => {
    const newDestinations = [...travelRoute.destinations]
    newDestinations.splice(index, 1)
    updateTravelRoute(travelRoute => ({ ...travelRoute, destinations: newDestinations }))
  }, [travelRoute.destinations, updateTravelRoute])

  const onAutocompleteBlur = useCallback(() => {
    setAvailableCityOptions(() => [])
  }, [])


  const allDestinationsAutocompletes = useMemo(() => travelRoute.destinations.map((cityName, index) => { 
    const label = travelRoute.destinations.length === 1 
      ? 'Destination city' 
      : `${numberToOrdinalString(index + 1)} destination`

    const removeButton = travelRoute.destinations.length > 1
      ? <Button variant="outlined" tabIndex={-1}
          onClick={() => onRemoveDestination(index)}>
          <RemoveCircleOutlineIcon />
        </Button>
      : null

    return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1em', alignItems: 'center' }} key={`destination-${index}`}>
      <Autocomplete id={`travel-route-${index}`}
        key={`destination-${index}`}
        options={availableCityOptions}
        value={cityName || ''}
        onInputChange={onCityInputChange}
        onChange={onCitySelect(`destination-${index}`)}
        onBlur={onAutocompleteBlur}
        isOptionEqualToValue={() => true}
        filterOptions={x => x}
        loading={optionsAreLoading}
        fullWidth
        renderInput={(params) => <TextField {...params} label={label} variant="outlined" size="small" />}
        />
      {removeButton}
    </Box>
    )
  }), [availableCityOptions, onAutocompleteBlur, onCityInputChange, onCitySelect, onRemoveDestination, optionsAreLoading, travelRoute.destinations])

 
  return (<Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em', flexGrow: 5 }}>
    <Autocomplete id={`travel-route-origin`}
      options={availableCityOptions}
      value={travelRoute.origin || ''}
      onInputChange={onCityInputChange}
      onChange={onCitySelect('origin')}
      onBlur={onAutocompleteBlur}
      isOptionEqualToValue={() => true}
      filterOptions={x => x}
      loading={optionsAreLoading}
      renderInput={(params) => <TextField {...params} label={'City of origin'} variant="outlined" size="small" />}
      fullWidth
      />

    {allDestinationsAutocompletes}
      
    <Button variant="outlined" onClick={onAddNextDestination}>Add next destination</Button>
  </Box>)
}
