import { Filter } from 'bad-words';

const filter = new Filter();

export const clean = (text) => filter.clean(text);
export const isProfane = (text) => filter.isProfane(text);
