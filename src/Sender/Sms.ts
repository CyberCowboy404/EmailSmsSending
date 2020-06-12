import { Sender, SenderConstructor } from './Sender';
export class Sms extends Sender {
  constructor({ type, contacts, content }: SenderConstructor) {
    super({ type, contacts, content });
  }
}