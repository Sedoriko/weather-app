import { useState, useMemo } from 'react';
import {
	Typography,
	Box,
	Grid,
	LinearProgress,
	Select,
	MenuItem,
	SelectChangeEvent,
	FormControl,
	InputLabel,
	Slide
} from '@mui/material';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { format, addDays } from 'date-fns';

import PageTitle from '../components/PageTitle';
import ForecastCard from '../components/ForecastCard';
import { ForecastType } from '../models/forecast';
import { fetcher } from '../utils/fetcher';
import { Option } from '../types/select';

type DayOptionValues = 'today' | 'tomorrow' | 'twoDaysLater';

const dayOptions: Option<DayOptionValues>[] = [
	{
		value: 'today',
		label: 'Today'
	},
	{
		value: 'tomorrow',
		label: 'Tomorrow'
	},
	{
		value: 'twoDaysLater',
		label: format(addDays(new Date(), 2), 'cccc')
	}
];

const resolveDate = (day: DayOptionValues): string => {
	const offset = day === 'twoDaysLater' ? 2 : day === 'tomorrow' ? 1 : 0;
	return format(addDays(new Date(), offset), 'yyyy-MM-dd');
};

const Forecast = () => {
	const { query } = useParams();
	const [day, setDay] = useState<DayOptionValues>('today');
	const date = useMemo(() => resolveDate(day), [day]);
	const { data, error } = useSWR<ForecastType, unknown>(
		`forecast.json?key=${process.env.REACT_APP_API_KEY}&q=${query}&dt=${date}`,
		fetcher,
		{ shouldRetryOnError: false, revalidateOnFocus: false }
	);

	if (error) {
		return <Typography align="center">Something went wrong...</Typography>;
	}

	const handleChange = (event: SelectChangeEvent<DayOptionValues>) => {
		event.preventDefault();
		setDay(event.target.value as DayOptionValues);
	};

	return (
		<Box sx={{ mb: '2rem' }}>
			<Grid container alignItems="center" gap={1}>
				<Slide direction="down" in timeout={600}>
					<Grid item>
						<PageTitle title="Hourly forecast" />
					</Grid>
				</Slide>
				<Slide direction="down" in timeout={600}>
					<Grid
						item
						container
						alignItems="center"
						gap={2}
						justifyContent="space-between"
					>
						<Grid item>
							{data && (
								<Typography variant="h4">
									{`${data.location.name}, ${data.location.country}`}
								</Typography>
							)}
						</Grid>

						<Grid item>
							<FormControl>
								<InputLabel id="forecast-day">Day</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={day}
									label="Day"
									onChange={handleChange}
								>
									{dayOptions.map(option => (
										<MenuItem key={option.value} value={option.value}>
											{option.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
					</Grid>
				</Slide>
			</Grid>
			{!data ? (
				<Box sx={{ mt: 5 }}>
					<LinearProgress />
				</Box>
			) : (
				data.forecast.forecastday[0]?.hour.map(data => (
					<ForecastCard key={data.time_epoch} data={data} />
				))
			)}
		</Box>
	);
};

export default Forecast;
