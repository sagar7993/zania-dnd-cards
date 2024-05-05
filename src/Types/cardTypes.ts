export interface Card {
	position: number;
	image: string;
	title: string;
	type: CardType;
}

export enum CardType {
	BankDraft = 'bank-draft',
	BankDraft2 = 'bank-draft-2',
	BillOfLading = 'bill-of-lading',
	BillOfLading2 = 'bill-of-lading-2',
	Invoice = 'invoice',
}
