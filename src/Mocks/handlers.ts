import { http, HttpResponse, PathParams } from 'msw';
import { Card, CardType } from '../Types/cardTypes';

const delay = (delayTimerInMilliseconds: number) => new Promise((resolve) => setTimeout(resolve, delayTimerInMilliseconds));

const DEFAULT_CARDS_DATA: Card[] = [
	{ type: CardType.BankDraft, title: 'Bank Draft', position: 0, image: 'https://images.unsplash.com/photo-1583083527882-4bee9aba2eea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' } as Card,
	{ type: CardType.BillOfLading, title: 'Bill of Lading', position: 1, image: 'https://images.unsplash.com/photo-1567270671170-fdc10a5bf831?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' } as Card,
	{ type: CardType.Invoice, title: 'Invoice', position: 2, image: 'https://images.unsplash.com/photo-1618799125361-6802b227c4af?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' } as Card,
	{ type: CardType.BankDraft2, title: 'Bank Draft 2', position: 3, image: 'https://images.unsplash.com/photo-1597838816882-4435b1977fbe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' } as Card,
	{ type: CardType.BillOfLading2, title: 'Bill of Lading 2', position: 4, image: 'https://images.unsplash.com/photo-1602779717364-d044d7492ed7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' } as Card
];

export const handlers = [
	http.get('/api/v1/cards', async () => {
		await delay(500);
		const cachedCards = JSON.parse(localStorage.getItem('zania-dnd-cards/cards') ?? '[]') as Card[];
		const cardsData = (cachedCards.length > 0) ? cachedCards : DEFAULT_CARDS_DATA;
		return HttpResponse.json(cardsData.sort((a, b) => a.position - b.position), { status: 200 });
	}),
	http.post<PathParams, { positions: { old: number; new: number }[]; }>('/api/v1/cards/reorder', async ({ request }) => {
		await delay(500);
		const data = await request.json();
		const cachedCards = JSON.parse(localStorage.getItem('zania-dnd-cards/cards') ?? '[]') as Card[];
		const cardsData = (cachedCards.length > 0) ? cachedCards : DEFAULT_CARDS_DATA;
		const upcatedCardsData = cardsData.map((card) => {
			const newPosition = data.positions.find((position) => position.old === card.position);
			return { ...card, position: newPosition?.new ?? card.position } as Card;
		});
		localStorage.setItem('zania-dnd-cards/cards', JSON.stringify(upcatedCardsData));
		return HttpResponse.json(upcatedCardsData, { status: 201 });
	}),
	http.post<PathParams, Card>('/api/v1/cards', async ({ request }) => {
		await delay(500);
		const data = await request.json();
		const cachedCards = JSON.parse(localStorage.getItem('zania-dnd-cards/cards') ?? '[]') as Card[];
		const cardsData = (cachedCards.length > 0) ? cachedCards : DEFAULT_CARDS_DATA;
		const upcatedCardsData = [...cardsData, { ...data, position: cardsData.length }] as Card[];
		localStorage.setItem('zania-dnd-cards/cards', JSON.stringify(upcatedCardsData));
		return HttpResponse.json(upcatedCardsData, { status: 201 });
	}),
	http.put<PathParams, Card>('api/v1/cards/:position', async ({ request, params }) => {
		await delay(500);
		const data = await request.json();
		const cachedCards = JSON.parse(localStorage.getItem('zania-dnd-cards/cards') ?? '[]') as Card[];
		const cardsData = (cachedCards.length > 0) ? cachedCards : DEFAULT_CARDS_DATA;
		if (cardsData.findIndex((card) => card.position === Number(params.position)) === -1) {
			return HttpResponse.json({ message: 'Card not found' }, { status: 404 });
		}
		const upcatedCardsData = cardsData.map((card) => {
			return card.position === Number(params.position) ? { ...card, ...data } : card;
		});
		localStorage.setItem('zania-dnd-cards/cards', JSON.stringify(upcatedCardsData));
		return HttpResponse.json(upcatedCardsData, { status: 200 });
	}),
	http.delete<PathParams, Card>('api/v1/cards/:position', async ({ params }) => {
		await delay(500);
		const cachedCards = JSON.parse(localStorage.getItem('zania-dnd-cards/cards') ?? '[]') as Card[];
		const cardsData = (cachedCards.length > 0) ? cachedCards : DEFAULT_CARDS_DATA;
		if (cardsData.findIndex((card) => card.position === Number(params.position)) === -1) {
			return HttpResponse.json({ message: 'Card not found' }, { status: 404 });
		}
		const upcatedCardsData = cardsData.filter((card) => card.position !== Number(params.position));
		localStorage.setItem('zania-dnd-cards/cards', JSON.stringify(upcatedCardsData));
		return HttpResponse.json(upcatedCardsData, { status: 200 });
	})
]