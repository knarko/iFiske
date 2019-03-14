import { UserProduct } from '../user/userTypes';
import { Omit } from '../../types';

export interface AdminOrganization {
  ID: number;
  at: number;
  ot: string;
  level: number;
}

export interface LogEntry {
  /**
   * Action taken
   *
   * - 0: Product was inspected (looked at)
   * - 1: Controller added +1 controls to the count
   * - 2: Controller removed one control
   * - 4: Controller cancelled the product
   * - 5: Controller un-cancelled the product
   * - 7: Controller added a written note
   */
  a: string;
  /** Comments - for example if the user wrote a note */
  c: string;
  /** User identification */
  u: string;
  /** Timestamp */
  t: number;

  action?: string;
}

export interface AdminPermit extends Omit<UserProduct, 'fine' | 'pid' | 'qr'> {
  ctrl: string;
  log?: LogEntry[];
  suborgid?: number;
}

export interface SearchMatch {
  arrayIndex: number;
  indices: Array<[number, number]>;
  key: string;
  value: string;
}

export type AdminPermitSearchResult = AdminPermit & { score?: number; matches?: SearchMatch[] };
