import { ContactInterface } from '../interfaces/Contact.interface';
export interface LetterInterface {
  id: string;
  content: string;
  contacts: ContactInterface[];
  sentTime?: number;
  status?: status;
  updateTime: number;
  createTime: number;
}

type status = 'DELIVERED' | 'FAILED';