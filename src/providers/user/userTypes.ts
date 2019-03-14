import { Product } from '../product/product';

export interface User {
  ID: number;
  username: string;
  loggedin: string;
  IP1: string;
  IP2: string;
  name: string;
  email: string;
  created: string;
  mypage: string;
  profile: string;
  adr?: string;
  town?: string;
  zip?: string;
}

export interface Favorite {
  ID: number;
  a: number;
  add: number;
  not: number;
  cnt: number;
}

export interface UserProduct {
  ID: number;
  adr: string;
  at: number;
  cc: string;
  city: string;
  code: number;
  email?: string;
  fine: string;
  fr: number;
  fullname: string;
  info: string;
  ot: string;
  pdf: string;
  pid: number;
  price: string;
  qr: string;
  ref1: number;
  ref2: number;
  rev: number;
  subt: string;
  t: string;
  tel: string;
  to: number;
  zip: string;

  validity?: string;
}
interface PermitRules {
  rule_ver: number;
  rule_d: string;
  rule_t: string;
}
export type Permit = UserProduct & Product & PermitRules;
