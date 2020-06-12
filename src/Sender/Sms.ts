import { Sender } from './Sender';
import { ContactInterface } from '../interfaces/Contact.interface';
import { type } from './Sender';
export class Sms extends Sender {
  constructor(type: type, contacts: ContactInterface[]) {
    super(type, contacts);
  }
}