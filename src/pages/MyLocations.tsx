import { Grid, Box, Typography, Slide, Fade } from '@mui/material';
import { NavLink } from 'react-router-dom';
import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult
} from 'react-beautiful-dnd';
import { useState, useEffect } from 'react';
import { updateDoc } from 'firebase/firestore';

import { userDataDocument } from '../utils/firebase';
import { FavoriteLocation } from '../components/FavoriteLocation';
import PageTitle from '../components/PageTitle';
import useUserContext from '../hooks/useUserContext';

const MyLocations = () => {
	const { user, userData } = useUserContext();
	const [locations, setLocations] = useState(userData?.locations ?? []);

	useEffect(() => {
		setLocations(userData?.locations ?? []);
	}, [userData]);

	const hasLocations = locations.length !== 0;

	const handleDragEnd = async (result: DropResult) => {
		if (!result.destination || !user?.email) {
			return;
		}

		const newLocations = locations ? [...locations] : [];
		const reordered = newLocations?.splice(result.source.index, 1);

		if (!reordered?.length) {
			return;
		}

		const [reorderedItem] = reordered;
		newLocations.splice(result.destination?.index, 0, reorderedItem);

		setLocations(newLocations);

		await updateDoc(userDataDocument(user.email), {
			locations: newLocations
		});
	};

	return (
		<div>
			<Grid container direction="column" gap={4}>
				<Slide direction="down" in timeout={500}>
					<Grid item>
						<PageTitle title="My locations" />
					</Grid>
				</Slide>
				{hasLocations ? (
					<DragDropContext onDragEnd={handleDragEnd}>
						<Droppable droppableId="favorite-locations-drag-and-drop">
							{provided => (
								<div {...provided.droppableProps} ref={provided.innerRef}>
									{locations.map((location, index) => (
										<Draggable
											key={location}
											draggableId={location}
											index={index}
										>
											{provided => (
												<Fade in timeout={700}>
													<Box
														ref={provided.innerRef}
														{...provided.draggableProps}
														sx={{ mb: 2 }}
													>
														<FavoriteLocation
															location={location}
															dragHandleProps={provided.dragHandleProps}
														/>
													</Box>
												</Fade>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</DragDropContext>
				) : (
					<Grid item>
						<Typography variant="h6">
							You have no favorite locations ...
						</Typography>
						<Typography variant="h6">
							Go{' '}
							<NavLink to="/search">
								<Typography component="span" variant="h6">
									here
								</Typography>
							</NavLink>{' '}
							and add some locations to your favorite list!
						</Typography>
					</Grid>
				)}
			</Grid>
		</div>
	);
};

export default MyLocations;
