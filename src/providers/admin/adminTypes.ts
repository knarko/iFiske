export interface AdminOrganization {
  ID: number;
  at: number;
  ot: string;
  level: number;
}

export interface AdminPermit {
  ID: number;
  at: number;
  code: number;
  fr: number;
  fullname: string;
  pdf: string;
  ref1: number;
  ref2: number;
  rev: number;
  suborgid: number;
  subt: string;
  t: string;
  tel: string;
  to: number;
  info?: string;

  validity?: string;
}

export interface SearchMatch {
  arrayIndex: number;
  indices: Array<[number, number]>;
  key: string;
  value: string;
}

export type AdminPermitSearchResult = AdminPermit & { score?: number; matches?: SearchMatch[] };
