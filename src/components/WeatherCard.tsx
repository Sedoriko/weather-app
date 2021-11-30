import {
	Box,
	Card,
	CardContent,
	Typography,
	Button,
	CardMedia,
	Grid,
	IconButton,
	Divider
} from '@mui/material';
import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import { StarOutline, Star, DragIndicator } from '@mui/icons-material';

import { CurrentWeatherType } from '../models/weather';

import LabeledItem from './LabeledItem';

type WeatherProps = {
	data: CurrentWeatherType;
};

const WeatherCard: FC<WeatherProps> = ({ data }) => {
	const [activeStar, setActiveStar] = useState(false);

	return (
		<Card sx={{ width: '100%', p: '1rem', pt: 0, boxShadow: 3 }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
				<Box sx={{ display: 'grid', placeItems: 'center' }}>
					<DragIndicator sx={{ color: grey[600], cursor: 'pointer' }} />
				</Box>
				<IconButton onClick={() => setActiveStar(previous => !previous)}>
					{activeStar ? <Star /> : <StarOutline />}
				</IconButton>
			</Box>
			<Divider />
			<CardContent>
				<Grid container>
					<Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
						<Typography variant="h5" component="h1" sx={{ mr: '1rem' }}>
							{data.location.name}
						</Typography>
						<Typography component="span" color="grey">
							{data.location.localtime}
						</Typography>
					</Grid>

					<Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column' }}>
						<Typography variant="h3" component="span" sx={{ my: '0.5rem' }}>
							{data.current.temp_c}°
						</Typography>
						<LabeledItem
							label="Feels like"
							content={`${data.current.feelslike_c}°`}
						/>
						<LabeledItem
							label="Humidity"
							content={`${data.current.humidity} %`}
						/>
						<LabeledItem
							label="Wind direction"
							content={`${data.current.wind_dir}`}
						/>
						<LabeledItem
							label="Wind speed"
							content={`${data.current.wind_kph} kph`}
						/>
						<Button
							component={Link}
							sx={{ width: '70%', mt: '2rem' }}
							variant="outlined"
							to={`/forecast/${data.location.name}`}
						>
							Show forecast
						</Button>
					</Grid>

					<Grid
						item
						xs={6}
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<CardMedia
							component="img"
							sx={{ width: '50%' }}
							image={data.current.condition.icon}
							alt="Condition icon"
						/>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
};

export default WeatherCard;
