import { Card } from '../Types/cardTypes';

export const fetchCards = async () => {
	const data = await fetch('/api/v1/cards');
	return data.json() as Promise<Card[]>;
};

export const reorderCards = async (positions: { old: number; new: number; }[]) => {
	const data = await fetch('/api/v1/cards/reorder', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ positions })
	});
	return data.json() as Promise<Card[]>;
};

export const createCard = async (card: Omit<Card, 'id'>) => {
	const data = await fetch('/api/v1/cards', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(card)
	});
	return data.json() as Promise<Card>;
};

export const updateCard = async (position: number, updates: Partial<Omit<Card, 'id' | 'type'>>) => {
	const data = await fetch(`/api/v1/cards/${position}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(updates)
	});
	return data.json() as Promise<Card>;
};

export const deleteCard = async (position: number) => {
	const data = await fetch(`/api/v1/cards/${position}`, {
		method: 'DELETE'
	});
	return data.json() as Promise<Card>;
};
