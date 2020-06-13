import { AccountInterface } from './Account.interface';
export type AdminConstructor = {
  name: string;
  email: string;
}
export interface AdminInterface {
  id: string;
  name: string;
  email: string;
  // Unix timespamp
  createTime: number;
  // Unix timespamp
  updateTime: number;
  account?: AccountInterface;
}
