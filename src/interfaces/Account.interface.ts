import { ContactInterface } from './Contact.interface';
export interface AccountInterface {
  id: string;
  name: string;
  adminId: string;
  createTime: number;
  updateTime: number;
  contacts: ContactInterface[];
}