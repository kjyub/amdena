/* eslint-disable no-unused-vars */
export enum TextFormats {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  NUMBER_ONLY = 'NUMBER_ONLY',
  PRICE = 'PRICE',
  TEL = 'TEL',
}

export type objectType = {
  [key: string | number]: any;
};

export interface IRawData {
  pageIndex: number;
  lastId: string;
  items: Array<object>;
  scrollLocation: number;
}
