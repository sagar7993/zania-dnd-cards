import { Card } from '../Types/cardTypes';
import { createRequestAtom } from './requestState';

export const cardsAtom = createRequestAtom<Card[]>();