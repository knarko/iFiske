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
  at: number;
  code: number;
  fr: number;
  fullname: string;
  ot: string;
  ref1: number;
  ref2: number;
  t: string;
  subt: string;
  to: number;
  pid: number;
  pdf: string;
  qr: string;
  fine: string;
  rev: number;
  tel: string;

  info?: string;
  validity?: string;
}
interface PermitRules {
  rule_ver: number;
  rule_d: string;
  rule_t: string;
}
export type Permit = UserProduct & Product & PermitRules;
