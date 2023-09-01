import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import * as dayjs from 'dayjs';

export const TravelDateInput = (props: { date: dayjs.Dayjs; setDate: (date: dayjs.Dayjs | null) => void; }) => {
  const { date, setDate } = props;

  const isInPast = date.isBefore(dayjs(), 'day');
  const slotProps = isInPast ? { textField: { sx: { margin: 0 }, helperText: 'Date cannot be in the past' }} : {};

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker label="Date of the trip" defaultValue={date} onChange={setDate} disablePast slotProps={{...slotProps}} />
    </LocalizationProvider>
  );
};
