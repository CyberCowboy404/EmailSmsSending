import { AccountInterface } from './Account.interface';
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
