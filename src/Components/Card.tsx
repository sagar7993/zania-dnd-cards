import { FC, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useSetAtom } from 'jotai';
import { Card as CardData } from '../Types/cardTypes';
import { cardsAtom } from '../State/cardState';
import { LazyImage } from './LazyImage';
import { Box, Button, CircularProgress, IconButton, Typography } from '@mui/material';
import { ControlCameraOutlined as DragIcon } from '@mui/icons-material';

export const Card: FC<{ card: CardData; loading?: boolean; onClick?: () => void; }> = ({ card, loading, onClick }) => {
	const setCardsData = useSetAtom(cardsAtom);

	const renderImageFallback = useCallback(() => {
		return (
			<Box className="cards-list-item-image-loader">
				<CircularProgress />
			</Box>
		)
	}, []);

	const [{ isDragging }, drag] = useDrag({
		type: 'zania-dnd-cards/cards',
		item: { position: card.position },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	const [, drop] = useDrop({
		accept: 'zania-dnd-cards/cards',
		hover: (item: { position: number }) => {
			const dragIndex = item.position;
			const hoverIndex = card.position;
			if (dragIndex === hoverIndex) {
				return;
			}
			setCardsData((prev) => {
				const newCards = [...(prev.data ?? [])];
				const dragCard = (prev.data ?? []).find((card) => card.position === dragIndex);
				const hoverCard = (prev.data ?? []).find((card) => card.position === hoverIndex);
				if (!dragCard || !hoverCard) {
					return prev;
				}
				const dragIndexInArray = (prev.data ?? []).indexOf(dragCard);
				const hoverIndexInArray = (prev.data ?? []).indexOf(hoverCard);
				newCards.splice(dragIndexInArray, 1);
				newCards.splice(hoverIndexInArray, 0, dragCard);
				return { ...prev, data: newCards };
			});
		},
	});

	return (
		<Button<"div">
			ref={(node) => drag(drop(node))}
			disableRipple={true}
			disabled={loading}
			onClick={onClick}
			className="cards-list-item"
			style={{ opacity: isDragging ? 0.5 : 1 }}
			component="div"
		>
			<IconButton disabled={loading} className="cards-list-item-drag-handle">
				<DragIcon />
			</IconButton>
			<LazyImage
				src={card.image}
				alt={card.title}
				className="cards-list-item-image"
				draggable={false}
				renderFallback={renderImageFallback}
			/>
			<Typography variant="h6" component="div" className="cards-list-item-label">
				{card.title}
			</Typography>
		</Button>
	)
};
