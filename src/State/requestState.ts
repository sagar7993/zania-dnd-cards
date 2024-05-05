import { atom } from 'jotai';
import { QueryRequest } from '../Types/request';

type CreateRequestAtomParams<T> = { data?: T; initialLoading?: boolean };

export function createRequestAtom<T>({ data, initialLoading }: CreateRequestAtomParams<T> = {}) {
	const requestDefaultAtom = atom<QueryRequest<T>>({
		loading: typeof initialLoading === 'boolean' ? initialLoading : !data,
		refreshing: !!data,
		data,
	});

	return requestDefaultAtom;
}