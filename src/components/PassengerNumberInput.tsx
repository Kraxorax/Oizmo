import { Box, Button, ButtonGroup, Typography } from "@mui/material";

export const PassengerNumberInput = (props: { numOfPassengers: number; setNumOfPassengers: (n: number) => void; }) => {
  const { numOfPassengers, setNumOfPassengers } = props;

  const canDecrement = numOfPassengers > 1
  const helperText = numOfPassengers >= 1 ? null : 'There must be at least one passenger'
  const helperComponent = helperText ? <Typography variant="caption" color="error">{helperText}</Typography> : null

  return (<Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }} >
    <Typography variant="body2">Number of passengers</Typography>
    <ButtonGroup variant="outlined" sx={{ justifyContent: 'center' }}>
      <Button onClick={() => setNumOfPassengers(numOfPassengers - 1 < 1 ? 1 : numOfPassengers - 1)}
        disabled={!canDecrement}
        variant="contained">-</Button>
      <Box sx={{ display: 'flex', alignItems: 'center', width: '2em', justifyContent: 'center' }}>
        {numOfPassengers}
      </Box>
      <Button onClick={() => setNumOfPassengers(numOfPassengers + 1)}
        variant="contained">+</Button>
    </ButtonGroup>
    {helperComponent}
  </Box>)
}
