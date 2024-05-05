import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button, CircularProgress, Modal, Typography, useMediaQuery } from '@mui/material';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import useQuery from '../Hooks/useQuery';
import useNotifications from '../Hooks/useNotification';
import { Card as CardData } from '../Types/cardTypes';
import { fetchCards, reorderCards } from '../Services/cardService';
import { cardsAtom } from '../State/cardState';
import { format12Hour } from '../Constants/date';
import { CARD_SAVE_INTERVAL_MILLISECONDS } from '../Constants/card';
import { Loader } from './Loader';
import { Card } from './Card';
import { ReactComponent as ZaniaLogo } from '../Assets/ZaniaLogo.svg';

import '../Styles/cards.css';
import { LazyImage } from './LazyImage';

export const Cards: FC = () => {
	const { addNotification } = useNotifications();
	const isNotMobile = useMediaQuery('(min-width:600px)');

	const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
	const [cardImageModalVisible, setCardImageModalVisible] = useState<CardData | null>(null);

	const getCardsData = useCallback(async () => {
		try {
			return fetchCards();
		} catch (error) {
			addNotification({ message: (error as Error).message ?? 'Failed to get cards', type: 'error' });
			throw error;
		}
	}, []);

	const {
		requestData: { data: cardsData, loading: cardsLoading, refreshing: cardsRefreshing, error: cardsError },
		setRefreshing: setCardsRefreshing,
	} = useQuery<CardData[]>({
		queryFunction: getCardsData,
		requestAtom: cardsAtom,
	});

	const reorderCardsData = useCallback(async (positions: { old: number; new: number }[]) => {
		setCardsRefreshing(true);
		try {
			await reorderCards(positions);
			setLastSavedAt(new Date());
		} catch (error) {
			addNotification({ message: (error as Error).message ?? 'Failed to save cards', type: 'error' })
		} finally {
			setCardsRefreshing(false);
		}
	}, [setCardsRefreshing, setLastSavedAt, addNotification]);

	const loading = useMemo(() => {
		return (cardsLoading || cardsRefreshing);
	}, [cardsLoading, cardsRefreshing]);

	useEffect(() => {
		const interval = setInterval(() => {
			reorderCardsData((cardsData ?? []).map((card, index) => ({ old: card.position, new: index })));
		}, CARD_SAVE_INTERVAL_MILLISECONDS);
		return () => clearInterval(interval);
	}, [cardsData, reorderCardsData]);

	const renderSaveButton = useCallback(() => {
		return (
			<Button
				variant="contained"
				className="cards-header-save-button"
				disabled={loading}
				onClick={() => reorderCardsData((cardsData ?? []).map((card, index) => ({ old: card.position, new: index })))}
			>
				{cardsRefreshing && (
					<Box className="cards-header-save-button-loader">
						<Loader variant="contained" color="white" strokeWidth={2} />
					</Box>
				)}
				<Typography variant="button" component="div" className="cards-header-save-button-label">Save</Typography>
			</Button>
		);
	}, [loading, cardsRefreshing, cardsData, reorderCardsData]);

	const renderImageFallback = useCallback(() => {
		return (
			<Box className="cards-image-modal-image-loader">
				<CircularProgress />
			</Box>
		)
	}, []);

	if (cardsLoading || cardsError) {
		return (
			<Box className="cards-container">
				<Loader />
			</Box>
		);
	}

	return (
		<Box className="cards-container">
			<Box className="cards-header">
				<Box className="cards-header-link-container">
					<a href="https://zania.ai" target="_blank" rel="noreferrer noopener nofollow" className="cards-header-link">
						<ZaniaLogo className="cards-header-logo" />
					</a>
					{!isNotMobile && renderSaveButton()}
				</Box>
				<Box className="cards-header-save-container">
					{lastSavedAt && <Box className="cards-header-save-timestamp">Last saved: {format12Hour(lastSavedAt)}</Box>}
					{isNotMobile && renderSaveButton()}
				</Box>
			</Box>
			{(cardsData ?? []).length > 0 && (
				<Box className="cards-list">
					<DndProvider backend={HTML5Backend}>
						{(cardsData ?? []).map((card, index) => {
							return (
								<Card key={index} card={card} loading={loading} onClick={() => setCardImageModalVisible(card)} />
							);
						})}
					</DndProvider>
				</Box>
			)}
			<Modal
				open={!!cardImageModalVisible}
				onClose={() => setCardImageModalVisible(null)}
			>
				<Box className="card-image-modal-container">
					<LazyImage
						src={cardImageModalVisible?.image}
						alt={cardImageModalVisible?.title}
						className="card-image-modal-image"
						draggable={false}
						renderFallback={renderImageFallback}
					/>
					<Box className="card-image-modal-action">
						<Button
							variant="contained"
							className="card-image-modal-cancel-button"
							disabled={loading}
							onClick={() => setCardImageModalVisible(null)}
						>
							CANCEL
						</Button>
					</Box>
				</Box>
			</Modal>
		</Box>
	);
};
